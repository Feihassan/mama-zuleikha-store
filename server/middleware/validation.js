import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

export const validateProduct = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required (1-255 chars)'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required (1-1000 chars)'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 1, max: 100 }).withMessage('Category is required (1-100 chars)'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  validateRequest
];

export const validateOrder = [
  body('customerName').trim().isLength({ min: 1, max: 255 }).withMessage('Customer name is required'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('customerPhone').matches(/^(\+?254|0)[17]\d{8}$/).withMessage('Valid Kenyan phone number required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be positive'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  validateRequest
];