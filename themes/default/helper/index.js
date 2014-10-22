var swag = require('swag');
var md5 = require('MD5');

swag.helpers.related = function(context, options) {
  var ret = '';
  if (!context) {
    return ret;
  }
  for (var i = 0; i < context.length; i++) {
    this.site.posts.each(function(post) {
      post.related_index = i;
      switch (post.related_index) {
        case 0:
          post.related_id = "left";
          break;
        case 1:
          post.related_id = "middle";
          break;
        case 2:
          post.related_id = "right";
          break;
      }
      if (post.uuid == context[i]) {
        ret += options.fn(post);
      }
    });
  }
  return ret;
}

swag.helpers.foreach = function(context, options) {
  var ret = ''
  context.each(function(item) {
    var vals = {}
    for (var name in item) {
      vals[name] = item[name]
    }
    ret += options.fn(vals)
  })
  return ret;
}

swag.helpers.gravatar = function(context, options) {
  var email = context;
  var size = (typeof(options.hash.size) === 'undefined') ? 32 : options.hash.size;

  return 'http://www.gravatar.com/avatar/' + md5(email) + '?s=' + size;
};

swag.helpers.tags = function(tags, options) {
  if (arguments.length === 1) {
    options = tags
    tags = this.tags
  }
  options = options.hash
  if (!tags || !tags.length) return
  return new Handlebars.SafeString((options.prefix || '') + tags.map(function(tag) {
    return '<a href="' + hexo.config.root + tag.path + '">' + tag.name + '</a>'
  }).join(options.separator || ' '))
};

swag.helpers.pageit = function(page, options) {
  var ret = '';
  return ret;
  var paginationValues = {}
  paginationValues.shown_pages = [];
  paginationValues.first_num = 1;
  paginationValues.first_current = page.current == 1;

  paginationValues.last_num = page.total;
  paginationValues.last_current = page.current == page.total;

  if (page.current > 2) {
    paginationValues.shown_pages.push({
      page_number: page.current - 1
    });

    if (page.current > 3) {
      paginationValues.first_separator = true;
    }

    paginationValues.shown_pages.push({
      page_number: page.current,
      current: true
    });
  } else {
    paginationValues.shown_pages.push({
      page_number: page.current,
      current: true
    });
  }

  if (page.current < page.total - 1) {
    paginationValues.shown_pages.push({
      page_number: page.current + 1
    });

    if (page.current < page.total - 2) {
      paginationValues.last_separator = true;
    }
  }

  ret = options.fn(paginationValues);
  return ret;
}

module.exports = swag.helpers;
