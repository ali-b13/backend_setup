const { getTransactionInfo } = require("./transfer");

module.exports.getSuccessPage = async (req, res, next) => {
    console.log('inside success')
  try {
    const data = await getTransactionInfo(req.params.transaction_id);
    if (data) {
        console.log('rendering success')
      res.render('successPage', { transaction: data.transactionInfo, receiverName: data.receiverName });
    } else {
      // Handle scenario when data is not found
      res.render('failPage', { error: 'Transaction not found' });
    }
  } catch (error) {
    // Handle any error occurred during fetching transaction info
    console.error(error);
    res.render('failPage', { error: 'Failed to retrieve transaction info' });
  }
  next()
};

module.exports.getFailPage = async (req, res, next) => {
  const error = req.params.error || 'Unknown error';
  res.render('failPage', { error: error });
  next()
};
