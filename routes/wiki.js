const express = require("express");
const router = express.Router();
const { Page, User } = require("../models");
const { main, addPage, editPage, wikiPage } = require("../views");

function generateSlug (title) {
  // Removes all non-alphanumeric characters from title
  // And make whitespace underscore
  return title.replace(/\s+/g, '_').replace(/\W/g, '');
}
Page.beforeValidation((page) => {
  page.slug = generateSlug(page.title)
})


// GET - wants something to read  /wiki
router.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) {
    next(error);
  }
});

// POST - creates something in our database and response back/wiki
router.post("/", async (req, res, next) => {
  try {
    // finding user or creating where name and email is pulled from the request
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });

    // creating a page based on what is pulled from req.body
    const page = await Page.create(req.body);

    // refer back to model index.js
    // it is setting authorId(foreign key) of page table to the user's primary key
    await page.setAuthor(user);

    res.redirect("/wiki/" + page.slug);
  } catch (error) {
    next(error);
  }
});

// PUT reading request and updating the whole data - /wiki/:slug
router.put("/:slug", async (req, res, next) => {
  try {
    const [updatedRowCount, updatedPages] = await Page.update(req.body, {
      where: {
        slug: req.params.slug
      },
      returning: true
    });

    res.redirect("/wiki/" + updatedPages[0].slug);
  } catch (error) {
    next(error);
  }
});

// DELETE /wiki/:slug
router.delete("/:slug", async (req, res, next) => {
  try {
    await Page.destroy({
      where: {
        slug: req.params.slug
      }
    });

    res.redirect("/wiki");
  } catch (error) {
    next(error);
  }
});

// GET /wiki/add
router.get("/add", (req, res) => {
  res.send(addPage());
});


// GET /wiki/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });
    if (page === null) {
      res.sendStatus(404);
    } else {
      const author = await page.getAuthor();
      res.send(wikiPage(page, author));
    }
  } catch (error) {
    next(error);
  }
});

// GET /wiki/:slug/edit
router.get("/:slug/edit", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    if (page === null) {
      res.sendStatus(404);
    } else {
      const author = await page.getAuthor();
      res.send(editPage(page, author));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
