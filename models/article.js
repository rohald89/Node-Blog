'use strict';
const Sequelize = require('sequelize');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

module.exports = (sequelize) => {
  class Article extends Sequelize.Model {}
    Article.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false, 
            unique: true,
            validate: {
                notEmpty: {
                  msg: "Please fill in a title."
                }
              }
        },
        description: {
            type: Sequelize.STRING,
        },
        markdown: {
            type: Sequelize.STRING,
            allowNull: false, 
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        slug: {
            type: Sequelize.STRING,
            required: true,
            unique: true,
        },
        sanitizedHTML: {
            type: Sequelize.STRING,
            required: true
        }

    }, { 
        hooks: {
        beforeValidate: (article) => {
            if(article.title){
                article.slug = slugify(article.title, {
                    lower: true,
                    strict: true
                });
            }
            if(article.markdown) {
                article.sanitizedHTML = dompurify.sanitize(marked(article.markdown));
            }
        }
    }, sequelize } );

    return Article;
};
