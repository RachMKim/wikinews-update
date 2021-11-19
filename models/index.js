const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
});

// page table
// column of title, slug, content, status
const Page = db.define('page', {
  title:{
    type: Sequelize.STRING,
    allowNull: false
  },
  slug:{
    type: Sequelize.STRING,
    allowNull:false,
    //since we are searching, editing, deleting by slug, these need to be unique
    unique: true
  },
  content:{
    type: Sequelize.TEXT,
    allowNull:false
  },
  status:{
    type: Sequelize.ENUM("open", "closed")
  }

})
const User = db.define("user", {
  name:{
    type: Sequelize.STRING,
    allowNull: false
  },
  email:{
    type: Sequelize.STRING,
    isEmail: true,
    allowNull: false
  }
})
// Section 5 part 2
// The first step towards knowing who has authored a page is creating a connection between our pages and users database tables via Sequelize. This is known as an relation or association.


// The association we suggest using in this case is Page belongsTo User. This will establish a connection that describes that a page has one user associated with it and that information will be established on the pages table rows (as opposed to on users rows).

// We can accomplish this with Sequelize with the following (should be placed in your models/index.js file after Page and User are defined):

// You may have to, at this point, include a { force: true } option on your .sync calls in order for Sequelize to drop previous tables created and create new ones with this updated structure. Keep in mind that dropping tables means the data in those tables will also be lost.

// Our new pages table (check your GUI) should have a new column authorId which will contain the id of the user associated with this page.

// We include { as: 'author' } in order to be more descriptive about the relation itself, rather than a user being associated with a page more generically. Note that this aliasing will affect how we interact with this association later on.

// creating association between user table/it's id
// Page belong to user // set author
Page.belongsTo(User, { as: 'author' });

module.exports = {db, Page, User}
