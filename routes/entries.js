var Entry = require('../lib/entry');

exports.list = function(req, res, next){
  //中间件session 依赖cookieParser, 签名cookie
  //connect默认会话cookie名, connect.sid
  // cookies {}
  // signedCookies { 'connect.sid': 'ogcC5nD7KsauQGKKOSDg7pm6jopMbrEV' }
  console.log('cookies', req.cookies)
  console.log('signedCookies', req.signedCookies)

  var page = req.page;
  Entry.getRange(page.from, page.perpage, function(err, entries) {
    if (err) return next(err);

    res.render('entries', {
      title: 'Entries',
      entries: entries,
    });
  });
};

exports.form = function(req, res){
  res.render('post', { title: 'Post' });
};

exports.submit = function(req, res, next){
  var data = req.body.entry;

  var entry = new Entry({
    "username": res.locals.user.name,
    "title": data.title,
    "body": data.body
  });

  entry.save(function(err) {
    if (err) return next(err);
    if (req.remoteUser) {
      res.json({message: 'Entry added.'});
    } else {
      res.redirect('/');
    }
  });
};
