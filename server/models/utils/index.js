function plainObject(obj) {
  return obj.get({ plain: true });
}

async function plainObjectOrNull(promiseObj) {
  const obj = await promiseObj;
  if (obj) {
    return plainObject(obj);
  }
  return null;
}

function deprecateObject(objId) {
  if (typeof objId === 'object') {
    process.emitWarning(
      'Calling accessors with an object is deprecated. Use obj.id instead',
      'DeprecationWarning',
    );
  }
}

module.exports = {
  plainObject,
  plainObjectOrNull,
  deprecateObject,
};
