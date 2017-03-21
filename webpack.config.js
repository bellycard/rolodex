const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/rolodex.css',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].css'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function() {
                  return [
                    require('postcss-smart-import')(),
                    require('postcss-css-variables')(),
                  ];
                }
              }
            }
          ]
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('rolodex.css')
  ]
};
