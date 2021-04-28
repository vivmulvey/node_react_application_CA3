import Article from '../models/Article.js';
import Image from '../models/Image.js';
import Comment from '../models/Comment.js';

const index = async function(req, res, next) {
    try {
        const articles = await Article.find({})
                                      .populate('tags')
                                      .populate('category')
                                      .populate('author')
                                      .populate('image')
                                      .exec();
        res.status(200).json(articles);
    }
    catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const show = async function(req, res, next) {
    try {
        const article = await Article.findById(req.params.id)
                                     .populate('tags')
                                     .populate('category')
                                     .populate('author')
                                     .populate('image')
                                     .populate({
                                         path: 'comments',
                                         populate: { path: 'author', model: 'User' }
                                      })
                                     .exec();

        if (article === null) {
            res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        else {
            res.status(200).json(article);
        }
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const store = async function (req, res, next) {
    try {
        const article = req.body;

        const image = new Image();
        image.path = "http://placeimg.com/640/480/nature";
        await image.save();
    
        const newArticle = new Article(article);
        newArticle.comments = [];
        newArticle.image = image._id;
        await newArticle.save();
    
        const createdArticle = await Article.findById(newArticle._id)
                                            .populate('tags')
                                            .populate('category')
                                            .populate('author')
                                            .populate('image')
                                            .exec();
        
            res.status(200).json(createdArticle);
    }
    catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const update = async function(req, res, next) {
    try {
        const article = await Article.findById(req.params.id)
                                     .exec();

        if (article === null) {
            res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        else {
            article.title = req.body.title;
            article.body = req.body.body;
            article.category = req.body.category;
            article.tags = req.body.tags;
            await article.save();

            const upDatedArticle = await Article.findById(req.params.id)
                                         .populate('tags')
                                         .populate('category')
                                         .populate('author')
                                         .populate('image')
                                         .exec();
        
            res.status(200).json(upDatedArticle);
        }
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const remove = async function(req, res, next) {
    try {
        const article = await Article.findById(req.params.id)
                                     .exec();

        if (article === null) {
            res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        else {
            await article.remove();
        
            res.status(204).json(null);
        }
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const storeComment = async function (req, res, next) {
    try {
      const article = await await Article.findById(req.params.id).exec();
  
      const comment = new Comment();
      comment.body = req.body.body;
      comment.author = req.user._id;
      comment.save();
  
      article.comments.push(comment._id);
      await article.save();
  
      comment.author = req.user;
  
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
  
  const updateComment = async function (req, res, next) {
    try {
      const article =  await Article.findById(req.params.articleId).exec();
      const comment = await Comment.findById(req.params.commentId).exec();
  
      if (article === null) {
        res.status(404).json({
          success: false,
          message: "Article not found",
        });
      } else if (comment === null) {
        res.status(404).json({
          success: false,
          message: "comment not found",
        });
        //only runs if the above are false
      } else {
        comment.body = req.body.body;
        comment.save();
        comment.author = req.user;
        res.status(200).json(comment);
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  const removeComment = async function (req, res, next) {
    try {
        //req.params.articleId goes into the request body and pulls out the id and setting it to a variable
        //array of parameters so we can access the data 
      const article = await Article.findById(req.params.articleId).exec();
      const comment = await Comment.findById(req.params.commentId).exec();
  
  
      if (article === null) {
        res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }else if(comment === null){
        res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      } else {
          //mongoose code to remove comment
        await comment.remove();
  
        res.status(204).json(null);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export { index, show, store, update, remove, storeComment, updateComment,removeComment };
  


