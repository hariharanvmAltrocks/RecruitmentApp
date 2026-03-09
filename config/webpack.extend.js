module.exports = (generatedConfiguration) => {

  generatedConfiguration.module.rules.push({
    test: /\.css$/,
    use: [
      "style-loader",
      "css-loader",
      "postcss-loader"
    ]
  });

  return generatedConfiguration;
};