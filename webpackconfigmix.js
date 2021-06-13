const path = require('path');

module.exports = {
  entry: {
    'bundle.js': [
      path.resolve(__dirname, 'src/js/index.js'),
	  path.resolve(__dirname, 'src/js/components/connection/connectionCmp.js'),
	  path.resolve(__dirname, 'src/js/components/conversations/conversationCmp.js'),
	  path.resolve(__dirname, 'src/js/components/conversations/conversationsCmp.js'),
      path.resolve(__dirname, 'src/js/components/conversations/messageCmp.js'),
	  path.resolve(__dirname, 'src/js/components/user/userCmp.js'),
	  path.resolve(__dirname, 'src/js/components/presence/presenceCmp.js'),
      path.resolve(__dirname, 'src/js/components/contacts/contactCmp.js'),
	  path.resolve(__dirname, 'src/js/components/contacts/contactsCmp.js')
    ]
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
  }
};