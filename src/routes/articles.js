"use strict";

const {HttpCode} = require(`../service/constants`);
const {Router} = require(`express`);
const articlesRoute = new Router();
const {readMock} = require(`../service/cli/readMock`);
const {nanoid} = require(`nanoid/async`);

articlesRoute.get(`/`, async (_req, res) => {
  const mocks = await readMock;
  res.status(HttpCode.OK).json(mocks);
});

articlesRoute.get(`/:articleId`, async (req, res) => {
  const mocks = await readMock;
  const articleId = req.params.articleId;
  const article = mocks.find((item) => item.id === articleId);
  if (article !== undefined) {
    res.status(HttpCode.OK).json(article);
  } else {
    res.status(HttpCode.NOT_FOUND).send(`Article not found`);
  }
});

articlesRoute.post(`/`, async (req, res) => {
  const mocks = await readMock;
  const id = await nanoid();
  const {title, announce, fullText, category, img} = req.body;
  if (title && announce && category) {
    const newArticle = ({
      id,
      comments: [],
      title,
      createdDate: new Date(),
      announce,
      fullText: fullText || `not set`,
      category,
      img: img || `not set`
    });
    mocks.push(newArticle);
    res.status(HttpCode.OK).json(mocks);
  } else {
    res.status(HttpCode.BAD_REQUEST).send(`Invalid parameters`);
  }
});

articlesRoute.put(`/:articleId`, async (req, res) => {
  const mocks = await readMock;
  const articleId = req.params.articleId;
  const article = mocks.find((item) => item.id === articleId);

  if (article !== undefined) {
    const {title, announce, fullText, category, img} = req.body;

    if (title && announce && category) {
      article.title = title;
      article.announce = announce;
      article.category = category;
      if (fullText) {
        article.fullText = fullText;
      }
      if (img) {
        article.img = img;
      }
      res.status(HttpCode.OK).json(article);
    } else {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid parameters`);
    }
  } else {
    res.status(HttpCode.BAD_REQUEST).send(`Article not found`);
  }
});

articlesRoute.delete(`/:articleId`, async (req, res) => {
  const articleId = req.params.articleId;
  const mocks = await readMock;
  const articleIndex = mocks.findIndex((item) => item.id === articleId);
  if (articleIndex !== -1) {
    mocks.splice(articleIndex, 1);
    res.status(HttpCode.OK).json(mocks);
  } else {
    res.status(HttpCode.BAD_REQUEST).json(`Server error!`);
  }
});

articlesRoute.get(`/:articleId/comments`, async (req, res) => {
  const mocks = await readMock;
  const articleId = req.params.articleId;
  if (articleId === undefined) {
    res.status(HttpCode.BAD_REQUEST).json(`Incorrect parameters`);
    return;
  } else {
    const articleIndex = mocks.find((item) => item.id === articleId);
    if (articleIndex !== undefined) {
      const comments = articleIndex.comments;
      res.status(HttpCode.OK).json(comments);
    } else {
      res.status(HttpCode.BAD_REQUEST).json(`Incorrect article`);
    }
  }
});

articlesRoute.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  const mocks = await readMock;
  const articleId = req.params.articleId;
  const commentId = req.params.commentId;
  if (articleId !== undefined && commentId !== undefined) {
    const articleIndex = mocks.findIndex((item) => item.id === articleId);
    if (articleIndex !== -1) {
      const commentIndex = mocks[articleIndex].comments.findIndex((item) => item.id === commentId);
      if (commentIndex !== -1) {
        mocks[articleIndex].comments.splice(commentIndex, 1);
        res.status(HttpCode.OK).json(mocks);
        return;
      } else {
        res.status(HttpCode.BAD_REQUEST).json(`Incorrect ids!`);
      }
    } else {
      res.status(HttpCode.BAD_REQUEST).json(`Incorrect ids!`);
    }
  } else {
    res.status(HttpCode.BAD_REQUEST).json(`Incorrect parameters!`);
  }
});

articlesRoute.post(`/:articleId/comments`, async (req, res) => {
  const mocks = await readMock;
  const articleId = req.params.articleId;
  const {text} = req.body;
  const id = await nanoid();
  if (text !== undefined && articleId !== undefined) {
    const comment = ({
      id,
      text
    });
    const articleIndex = mocks.findIndex((item) => item.id === articleId);
    if (articleIndex !== -1) {
      mocks[articleIndex].comments.push(comment);
      res.status(HttpCode.OK).json(mocks);
    } else {
      res.status(HttpCode.BAD_REQUEST).json(`Incorrect article`);
    }
  } else {
    res.status(HttpCode.BAD_REQUEST).send(`Invalid parameters`);
  }
});

module.exports = articlesRoute;
