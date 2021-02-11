const express = require('express');
const router = express.Router();
const Article = require('../models').Article;

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next) 
        } catch (error) {
            res.status(500).send(error);
        }
    }
}
router.get('/new', (req, res) => {
    res.render("articles/new", {article: new Article()});
});

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    res.render("articles/edit", { article });
});

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({
        where: {
            slug: req.params.slug
        }
    });
    if(article == null){
        res.redirect('/');
    }
    res.render('articles/show', { article });
});

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next()
}, saveArticleAndRedirect('new'));

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findByPk(req.params.id);
    next()
}, saveArticleAndRedirect('edit'));

router.delete('/:id', asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    article.destroy();
    res.redirect('/');
}));

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
            article.title = req.body.title;
            article.description = req.body.description;
            article.markdown = req.body.markdown;
        try {
            article = await article.save();
            console.log(article);
            res.redirect('/articles/' + article.slug);
        } catch (error) {
            if(error.name === 'SequelizeUniqueConstraintError'){
                res.render(`articles/${path}`, { article, error: 'Post with this title already excists please enter a unique title' });
            }
            res.render(`articles/new${path}`, { article });
        }
    }
}



module.exports = router;