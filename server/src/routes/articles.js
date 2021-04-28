import { Router } from 'express';
import passport from 'passport';

import { 
    validateNewArticle, 
    validateArticleId, 
    validateArticleUpdate 
} from '../middleware/validation/article.js';

//
import { 
    index, 
    show, 
    store,
    update,
    remove,
    removeComment,
    updateComment,
    storeComment
} from '../controllers/articleController.js'

const articlesRouter = Router();   

articlesRouter.get('/', index);

articlesRouter.get('/:id', validateArticleId, show);

articlesRouter.post('/', 
    passport.authenticate('jwt', { session: false }), 
    validateNewArticle, 
    store
);

articlesRouter.put('/:id', 
    passport.authenticate('jwt', { session: false }), 
    validateArticleId, 
    validateArticleUpdate, 
    update
);

articlesRouter.delete('/:id', 
    passport.authenticate('jwt', { session: false }), 
    validateArticleId, 
    remove
);

//Comments routes
articlesRouter.post(
    "/:id/comments",
    passport.authenticate("jwt", { session: false }),
    storeComment
  );
  articlesRouter.put(
    "/:articleId/comments/:commentId",
    passport.authenticate("jwt", { session: false }),
    updateComment
  );
  articlesRouter.delete(
    "/:articleId/comments/:commentId",
    passport.authenticate("jwt", { session: false }),
    removeComment
  );

export default articlesRouter;