const router = require('express').Router();
const User = require('../../models/User');
const withAuth = require('../../utils/auth');

// CREATE NEW USER
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      /*req.session.isLogin = false;
      req.session.isDashboard = false;
      req.session.isHome = true;*/


      res.json(dbUserData);
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGIN WITH USER
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!dbUserData) {
      res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
    }
    const validPassword = await dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password. Please try again!' });
    }
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.loggedIn = true;
      req.session.isLogin = true;
      req.session.isDashboard = false;
      req.session.isHome = false;

      res.status(200).json({ user: dbUserData, message: `You are now logged in! ${dbUserData.id}`, isLogin: req.session.isLogin, isDashboard:req.session.isDashboard, isHome: req.session.isHome  });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGOUT 
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      /*req.session.isLogin = false;
      req.session.isDashboard = false;
      req.session.isHome = true;*/
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// EDIT BLOG BY ID 
router.get('blog/edit/:id', withAuth, (req, res) => {
  Blog.findOne({
          where: {
              id: req.params.id
          },
          attributes: ['id',
              'title',
              'content',
              'create_date'
          ],
          include: [{
                  model: User,
                  attributes: ['username']
              },
              {
                  model: Comment,
                  attributes: ['id', 'text', 'blog_id', 'user_id', 'date'],
                  include: {
                      model: User,
                      attributes: ['username']
                  }
              }
          ]
      })
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No blog found with this id' });
              return;
          }
          const post = dbPostData.get({ plain: true });
          req.session.isLogin = false;
            req.session.isDashboard = false;
            req.session.isHome = true;
            
          res.render('EditPost', { post, loggedIn: req.session.loggedIn , blogs, loggedIn: req.session.loggedIn , isLogin: req.session.isLogin, isDashboard:req.session.isDashboard, isHome: req.session.isHome  });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
})

module.exports = router;
