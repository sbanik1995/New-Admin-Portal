const ProjectDocument = require('../models/ProjectDocument');

exports.uploadDocument = async (req, res) => {
  const { title, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'Document file is required.' });
  }

  const document = await ProjectDocument.create({
    title,
    description,
    filePath: `/uploads/documents/${req.file.filename}`,
    originalFileName: req.file.originalname,
  });

  return res.status(201).json(document);
};

exports.getDocuments = async (req, res) => {
  const documents = await ProjectDocument.find().sort({ createdAt: -1 });
  res.status(200).json(documents);
};
