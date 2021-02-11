const express = require('express');
const { sequelize } = require('./models');
const articleRouter = require('./routes/articles');
const Article = require('./models').Article;
const methodOverride = require('method-override');
const app = express();


const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use("/articles", articleRouter);

app.get('/', async (req, res) => {
    const articles = await Article.findAll({order: [["createdAt", "DESC"]]});
    res.render('articles/index', { articles });
});

sequelize.sync().then(() => {
    app.listen(port, () => {  
        console.log(`Server is up on port: ${port} `)
    });
});