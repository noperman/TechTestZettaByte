var express = require('express');
var router = express.Router();
const Article = require('../models/article')
const Comment = require('../models/comment')

/** ===================== ARTICLE ===================== */
/** 2. Api to do Read on article with sorting, filter & pagination using aggregation */
  /** GET */
  router.get('/article', async (req, res, next) => {
    try{
      const params = req.query

      const visible = params.visible ? params.visible : 0;
      const offset = params.page ? params.page * visible - visible : 0;
      const like = params.search ? params.search : "";
      const sort = params.sort ? (params.sort === 'asc' || params.sort === 'desc') ? params.sort : 'asc' : "asc";

      const article = await Article.find({ "title": { $regex: '.*' + like + '.*' }}).populate('comments').skip(parseInt(offset)).limit(parseInt(visible)).sort({createdAt:sort})

      res.send(article)
    }catch(e){
      res.status(500).json({msg: e.message});
    }
  }); 
/** 2. Api to do Read on article with sorting, filter & pagination using aggregation */

/** 1. Api to do Create, Update, Delete on article */
  /** CREATE */
  router.post('/article', async (req, res, next) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })

    try{
      const resp = await article.save()
      res.status(201).json(resp)
    }catch(e){
      res.status(400).json({msg: e.message});
    }  
  });

  /** UPDATE */
  router.patch('/article/:id', getArticle, async function(req, res, next) {
    if(req.body.title != null){
      res.article.name = req.body.name;
    }
    if(req.body.content != null){
      res.article.content = req.body.content;
    }

    try{
      const updateArticle = await res.article.save()
      res.json(updateArticle)
    }catch(e){res.status(400).json({msg: e.message});}
  });

  /** DELETE */
  router.delete('/article/:id', getArticle, async function(req, res, next) {
    try{
      await res.article.remove().then(async (artcile)=>{
        const comments = await Comment.findOne({articleID: artcile._id})

        if(comments !== null){
          await Comment.remove({articleID: artcile._id})
        }
      })
      res.json({msg: 'Deleted article'})
    }catch(e){res.status(500).json({msg:e.message})}
  });

  /** can be middleware at get,update and delete */
  async function getArticle(req,res,next){
    let article
    try{
      article = await Article.findById(req.params.id)
      if(article === null){
        return res.status(404).json({msg: "Cannot find article"});
      }
    }catch(e){
      return res.status(500).json({msg: e.message})
    }

    res.article = article;
    next()
  }
  /** can be middleware at get,update and delete */
/** 1. Api to do Create, Update, Delete on article */

/** ===================== COMMENT ===================== */
/** 3. Api to do CRUD on comment */
  /** GET */
  router.get('/comment', async (req, res, next) => {
    try{
      const comment = await Comment.find() 

      res.send(comment)
    }catch(e){
      res.status(500).json({msg: e.message});
    }
  }); 

  /** CREATE */
  router.post('/comment', async (req, res, next) => {
    try{
      const article = await Article.findById(req.body.articleID)
      
      if(article === null){
        return res.status(404).json({msg: "Cannot find article"});
      }else{
        const comment = new Comment({
          articleID: req.body.articleID,
          name: req.body.name,
          comment: req.body.comment
        })
      
        try{
          const resp = await comment.save().then((res)=>{
            article.comments.push(res._id)
            article.save()
          })

          res.status(201).json(resp)
        }catch(e){
          res.status(400).json({msg: e.message});
        }
      }
    }catch(e){res.status(500).json({msg: e.message});}
  });

  /** UPDATE */
  router.patch('/comment/:id', getComment, async function(req, res, next) {
    if(req.body.name != null){
      res.comment.name = req.body.name;
    }
    if(req.body.comment != null){
      res.comment.comment = req.body.comment;
    }

    try{
      const updateComment = await res.comment.save()
      res.json(updateComment)
    }catch(e){res.status(400).json({msg: e.message});}
  });

  /** DELETE */
  router.delete('/comment/:id', getComment, async function(req, res, next) {
    try{
      await res.comment.remove()
      res.json({msg: 'Deleted comment'})
    }catch(e){res.status(500).json({msg:e.message})}
  });

  /** can be middleware at get,update and delete */
  async function getComment(req,res,next){
    let comment
    try{
      comment = await Comment.findById(req.params.id)
      if(comment === null){
        return res.status(404).json({msg: "Cannot find comment"});
      }
    }catch(e){
      return res.status(500).json({msg: e.message})
    }

    res.comment = comment;
    next()
  }
  /** can be middleware at get,update and delete */
/** 3. Api to do CRUD on comment */
module.exports = router;
