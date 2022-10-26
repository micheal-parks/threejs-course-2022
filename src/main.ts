import './main.css'

const routes = Object.fromEntries(
  Object.entries(
    import.meta.glob('./lessons/**/*.ts')
  ).map(([key, value]) =>
    [key.replace('.ts', '').replace('./lessons/', '').replace('/', '-'), value]
  )
)

console.log(location.hash)

if (location.hash) {
  routes[location.hash.slice(1)]?.()
}
