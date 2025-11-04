1/turbopackFileSystemCacheForDev : true
2/ App Router
  --page.tsx
  --layout.tsx

3/Client and Server Component
Why and when should you use the Client and Server Side Component.
 -- For clicking like interacting with button, navigation, user command(input field) keep that in client otherwise 
    keep them on server

4/
pnpm install babel-plugin-react-compiler@latest
on next.config.ts >> reactCompiler: true,

5/nested routes
6/dynamic routes

const userDetails = async({params}: {params: Promise <{id:String}>}) => {
    const {id} = await params;

    return (
        <div>
            <h1> showing details for user # {id}<h1>
        </div>
    )
}

8/route group .
9/Routing Optimization .
  Optimized navigations and prefetching with layout deduplication and incremental prefetching.
  On next js 16 on multiple route group 
  such as dashboard/layout.tsx 
          dashboard/layout/metrics.tsx
          dashboard/layout/invoice
It download only once the layout with no cold changes.

10/ HMR Cache and how its related to the Data Fetching.
11/ Why server side data fetching is superior than client side data fetching(UseEffect)
     - better seo
     - better security api key never exposed
     - reduced network waterfall 
     - if browser debug javascript has off , it would still work
     
12/ Caching :
    - browser cache
    - server cache
    - data cache