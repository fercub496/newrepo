exports.get404 = (req, res) => {
    res.status(404).render('errors/error', {
      title: '404 - Page Not Found',
      message: 'Sorry, we appear to have lost that page.',
      nav: req.nav || []
    });
  };

  exports.get500 = (err, req, res, next) => {
    const message = err.status === 404 ? err.message : 'Oh no! There was a crash. I advise to try a different route.';
    res.status(err.status || 500).render('errors/500', {
      title: err.status || '500 - Server Error',
      message,
      nav: req.nav || []
    });
  };