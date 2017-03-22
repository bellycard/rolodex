const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    rolodex: './src/rolodex.css'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].css'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: function() {
                  return [
                    require('postcss-import')(),
                    require('postcss-cssnext')(),
                  ];
                }
              }
            }
          ]
        })
      },
    ]
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
  ]
};
