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


module.exports = {
  plainObject,
  plainObjectOrNull,
};
