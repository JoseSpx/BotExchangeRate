'use strict';

const test = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Lambda Running succesfully!',
        input: event,
      },
      null,
      2
    ),
  };
}

module.exports = {
  test
}
