import { categoryModel } from '../models/category-model.js';

export const categoryController = {
  async list(req, res, next) {
    try {
      const categories = await categoryModel.list();
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const created = await categoryModel.create(req.body);
      return res.status(201).json({ success: true, data: created });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await categoryModel.update(req.params.id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return next(error);
    }
  }
};
