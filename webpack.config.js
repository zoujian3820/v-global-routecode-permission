const { resolve } = require('path')
// webpack5强制要求依赖 requires，自动下载
// eslint-disable-next-line import/no-extraneous-dependencies
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    index: './package/index.js'
  },
  output: {
    clean: true, // 在生成文件之前清空 output 目录
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
    libraryExport: 'default',
    library: '[name]', // 整个库向外暴露的变量名
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // 排除 node modules
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 预设：指示babel做怎么样的兼容性处理
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // 按需加载
                    useBuiltIns: 'usage',
                    // 指定core-js版本
                    corejs: {
                      version: 3
                    },
                    // 指定兼容性做到哪个版本浏览器
                    targets: {
                      chrome: '60',
                      firefox: '60'
                      //   ie: '9',
                      //   safari: '10',
                      //   edge: '17'
                    }
                  }
                ]
              ]
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              // 自动修复eslint的错误
              fix: true
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        // 开启多进程打包
        parallel: true,
        terserOptions: {
          // 删除注释
          output: {
            comments: false
          },
          compress: {
            // 去除debug、console
            warnings: true,
            drop_debugger: true,
            drop_console: true,
            pure_funcs: ['console.log'] // 移除console
          }
        }
      })
    ]
  },
  resolve: {
    // 配置省略文件路径的后缀名
    extensions: ['.js'],
    // 告诉 webpack 解析模块是去找哪个目录
    modules: ['node_modules']
  },
  mode: 'production'
}
