const Media = require('../model/Media');
const { mediaApi } = require('../../utils/storeMedia');

const MediaController = {};

// Get all media files with filtering and pagination
MediaController.list = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            fileType,
            category,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};

        // Filter by file type
        if (fileType && fileType !== 'all') {
            query.fileType = fileType;
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Search by filename or alt text
        if (search) {
            query.$or = [
                { filename: { $regex: search, $options: 'i' } },
                { originalName: { $regex: search, $options: 'i' } },
                { altText: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const media = await Media.find(query)
            .populate('uploadedBy', 'name email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Media.countDocuments(query);

        res.json({
            success: true,
            data: media,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching media',
            error: error.message
        });
    }
};

// Get single media file
MediaController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findById(id).populate('uploadedBy', 'name email');

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        res.json({
            success: true,
            data: media
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching media',
            error: error.message
        });
    }
};

// Upload new media file
MediaController.upload = async (req, res) => {
    try {
        const { fileType, category, altText, description, tags } = req.body;
        const file = req.files?.mediaFile || req.file;
        console.log(file, "File in upload media");
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Determine file type based on mime type
        let detectedFileType = 'other';
        if (file.mimetype.startsWith('image/')) {
            detectedFileType = 'image';
        } else if (file.mimetype.startsWith('video/')) {
            detectedFileType = 'video';
        } else if (file.mimetype.startsWith('audio/')) {
            detectedFileType = 'audio';
        } else if (file.mimetype.includes('pdf') || file.mimetype.includes('document') || file.mimetype.includes('text')) {
            detectedFileType = 'document';
        }

        // Upload file using mediaApi
        const fileBuffer = file.buffer || file.data;
        const uploadedFile = await mediaApi.uploadSingle(fileBuffer, {
            fileName: file.name || file.originalname
        });

        // Parse tags if provided as string
        let parsedTags = [];
        if (tags) {
            parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
        }

        // Get image dimensions if it's an image
        let dimensions = {};
        if (detectedFileType === 'image') {
            // You can add image dimension detection here if needed
            // For now, we'll leave it empty
        }

        const media = await Media.create({
            filename: uploadedFile.data.filename || file.name || file.originalname,
            originalName: file.name || file.originalname,
            filePath: uploadedFile.data.path,
            fileUrl: uploadedFile.data.url || uploadedFile.data.path,
            mimeType: file.mimetype,
            fileSize: file.size,
            fileType: fileType || detectedFileType,
            category: category || 'general',
            altText: altText || '',
            description: description || '',
            uploadedBy: req.user?.id || 'unknown', // Handle case where user might not be available
            tags: parsedTags,
            dimensions: dimensions
        });

        res.status(201).json({
            success: true,
            data: media,
            message: 'Media uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading media',
            error: error.message
        });
    }
};

// Update media metadata
MediaController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { altText, description, category, tags, isPublic } = req.body;

        const updateData = {};
        if (altText !== undefined) updateData.altText = altText;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (isPublic !== undefined) updateData.isPublic = isPublic;
        if (tags !== undefined) {
            updateData.tags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
        }

        const media = await Media.findByIdAndUpdate(id, updateData, { new: true })
            .populate('uploadedBy', 'name email');

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        res.json({
            success: true,
            data: media,
            message: 'Media updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating media',
            error: error.message
        });
    }
};

// Delete media file
MediaController.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Media.findByIdAndDelete(id);
        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        // TODO: Delete actual file from storage if needed

        res.json({
            success: true,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting media',
            error: error.message
        });
    }
};

// Get media statistics
MediaController.stats = async (req, res) => {
    try {
        const stats = await Media.aggregate([
            {
                $group: {
                    _id: '$fileType',
                    count: { $sum: 1 },
                    totalSize: { $sum: '$fileSize' }
                }
            }
        ]);

        const totalMedia = await Media.countDocuments();
        const totalSize = await Media.aggregate([
            { $group: { _id: null, total: { $sum: '$fileSize' } } }
        ]);

        res.json({
            success: true,
            data: {
                totalMedia,
                totalSize: totalSize[0]?.total || 0,
                byType: stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching media statistics',
            error: error.message
        });
    }
};

module.exports = MediaController;
