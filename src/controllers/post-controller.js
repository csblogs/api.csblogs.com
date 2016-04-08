import BlogPost from '../database/models/blog-post';
import log from '../log';

function removeNonPublicAttributes(post) {
  const apiSafePost = post;
  delete apiSafePost.createdAt;
  delete apiSafePost.updatedAt;
  return apiSafePost;
}

export function getAll() {
  return new Promise((resolve, reject) => {
    BlogPost.findAll({
      order: [
        ['date_published', 'DESC']
      ],
      raw: true
    }).then(allPosts => {
      const apiSafePosts = allPosts.map(post => removeNonPublicAttributes(post));
      resolve(apiSafePosts);
    }).catch(error => {
      log.error({ error }, 'Error getting list of all posts');
      reject(error);
    });
  });
}

export function getById(id) {
  return new Promise((resolve, reject) => {
    BlogPost.findOne({
      where: { id },
      raw: true
    }).then(post => {
      post ? resolve(removeNonPublicAttributes(post)) : resolve(null);
    }).catch(error => {
      log.error({ error }, 'Error getting blog post by id');
      reject(error);
    });
  });
}

export function getPage(pageNumber, pageSize) {
  return new Promise((resolve, reject) => {
    BlogPost.findAll({
      order: [
        ['date_published', 'DESC']
      ],
      offset: pageNumber * pageSize,
      limit: pageSize,
      raw: true
    }).then(pageOfPosts => {
      resolve(pageOfPosts.map(post => removeNonPublicAttributes(post)));
    }).catch(error => {
      log.error({ error }, 'Error getting page of posts');
      reject(error);
    });
  });
}
