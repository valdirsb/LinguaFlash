// App.vue
export default {
  name: 'App',
  setup() {
    const { isAuthenticated, user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
      logout()
      router.push('/login')
    }

    return {
      isAuthenticated,
      user,
      handleLogout
    }
  }
}