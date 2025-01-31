const express = require('express');
const Profile = require('../models/profileModel');
const { authenticateToken } = require('../authentication/auth');
const multer = require('multer');
require('dotenv').config();
const supabase = require('../common/supabaseClient');

const router = express.Router();

// Initialize Backblaze B2


// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check if the file is a PDF
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed.'));
    }
    cb(null, true);
  },
});


router.post('/profile/create', authenticateToken, upload.single('resume'), async (req, res) => {
  // console.log('Request body:', req.body); // Log to check form data
  console.log('Uploaded file:', req.file);
  // console.log('user:', req.user) // Log to check file data

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    programmingLanguages,
    technologies,
    skills,
    experiences,
  } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    // Upload to Supabase (Backblaze)
    const { data, error } = await supabase.storage
      .from('pdfurl')
      .upload(req.file.originalname, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {

      return res.status(500).json({ error: error.message });
    }

    // Generate signed URL (if the bucket is private)
    // const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    //   .from('pdfurl')
    //   .createSignedUrl(req.file.originalname, 60 * 60); // 1-hour validity

    // const url = String(signedUrlData.signedUrl)
    // console.log(url)
    console.log(req.file.originalname)
    const namePDF = req.file.originalname
    const fileUrl = supabase.storage.from('pdfurl').getPublicUrl(namePDF);

    console.log('File URL:', fileUrl.data.publicUrl);
  
    const profile = new Profile({
      user_Id: req.user.id,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      programmingLanguages,
      technologies,
      skills,
      experiences,
      resume: fileUrl.data.publicUrl,
    });
    await profile.save();


    // Continue with profile creation logic
    res.status(201).json({ message: 'Resume uploaded successfully', data });

  } catch (error) {
    console.error('Error uploading resume:', error);
    return res.status(500).json({ error: 'Error uploading resume to Backblaze' });
  }
});


module.exports = router;
