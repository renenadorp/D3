/** @type {import('next').NextConfig} */
const nextConfig = {
        webpack: (config) => {
          /* add to the webpack config module.rules array */
          config.module.rules.push({
            /* `test` matches file extensions */
            test: /\.(numbers|xls|xlsx|xlsb)/,
            /* use the loader script */
            use: [ { loader: './base64-loader' } ]
          });
          return config;
        }
    

    // // Can be safely removed in newer versions of Next.js
    // future: {
  
    //   // by default, if you customize webpack config, they switch back to version 4.
    //   // Looks like backward compatibility approach.
    //   webpack5: true,   
    // },
  
    // webpack(config) {
    //   config.resolve.fallback = {
  
    //     // if you miss it, all the other options in fallback, specified
    //     // by next.js will be dropped.
    //     ...config.resolve.fallback,  
  
    //     fs: false, // the solution
    //     path: false, 
    //     stream: false, 
    //     constants: false 
    //   };
      
    //   return config;
    // },
  };

module.exports = nextConfig
