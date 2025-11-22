import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  deleteSubCategory,
} from './category.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getCategories);
router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

router.post('/subcategories', createSubCategory);
router.delete('/subcategories/:id', deleteSubCategory);

export default router;
