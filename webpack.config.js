const path = require('path'); // подключение path к конфигу вебпак
const HtmlWebpackPlugin = require('html-webpack-plugin'); // подключение плагина
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // подключение плагина
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // подключение к проекту mini-css-extract-plugin

module.exports = { // module.exports — синтаксис экспорта в Node.js 
    entry: { main: './src/index.js' }, // первое место, куда заглянет webpack, — файл index.js в папке src 
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: ''
    }, // в какой файл будет собираться весь js
    mode: 'development', // добавлние режима разработчика
    devServer: {
        static: path.resolve(__dirname, './dist'), // путь, куда "смотрит" режим разработчика
        compress: true, // это ускорит загрузку в режиме разработки
        port: 8080, // порт, чтобы открывать сайт по адресу localhost:8080
        open: true // сайт будет открываться сам при запуске npm run dev
    },
    module: {
      rules: [ // rules — это массив правил
        // добавление в него объект правил для бабеля
        {
          // регулярное выражение, которое ищет все js файлы
          test: /\.js$/,
          // при обработке этих файлов нужно использовать babel-loader
          use: 'babel-loader',
          // исключает папку node_modules, файлы в ней обрабатывать не нужно
          exclude: '/node_modules/'
        },
        // добавление правила для обработки файлов
        {
          // регулярное выражение, которое ищет все файлы с такими расширениями
          test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
          type: 'asset/resource'
        },
        {
          // применять это правило только к CSS-файлам
          test: /\.css$/,
          // при обработке этих файлов нужно использовать
          // MiniCssExtractPlugin.loader и css-loader
          use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            // добавление объекта options
            options: { importLoaders: 1 }
          },
          'postcss-loader'] // Добавление postcss-loader
        }
      ]
  },
  plugins: [ // добавление массива
    new HtmlWebpackPlugin({
      template: './src/index.html' // путь к файлу index.html
    }),
    new CleanWebpackPlugin(), // использование плагина
    new MiniCssExtractPlugin() // подключение плагина для объединения файлов
  ] 
}
