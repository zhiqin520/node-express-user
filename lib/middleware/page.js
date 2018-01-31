module.exports = function (fn, perpage) {
    perpage = perpage || 10; //每页默认10条
    return function (req, res, next) {
        var page = Math.max(
            parseInt(req.param('page') || '1', 10),
            1)
            - 1;

        fn(function (err, total) {
            if (err) return next(err);

            //page中间件, 将page对象存储到req.page, 以便后面访问
            req.page = res.locals.page = {
                number: page,
                perpage: perpage,
                from: page * perpage,
                to: page * perpage + perpage - 1,
                total: total,
                count: Math.ceil(total / perpage)
            };

            next();
        });
    }
};
