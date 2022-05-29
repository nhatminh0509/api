import Permissions from "src/core/permissions"

const seedData = {
  role: {
    name: 'admin',
    permissions: [Permissions.ALL],
    priority: 10,
    orgSlug: 'dev-tools',
    slug: 'dev-tools-admin'
  },
  user: {
    displayName: 'Minh Nhật',
    email: 'leminhnhat1133@gmail.com',
    password: '123456',
    phone: '0704917152',
    username: 'nhatminh0509',
    avatar: 'https://scontent.fsgn17-1.fna.fbcdn.net/v/t39.30808-6/283282750_3274531602779792_7923593249289426795_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=dWSUOM0uhKsAX-IABXN&_nc_oc=AQmLZRx8aiepM-gEUV3lVhSXUzlnABem-gp0xI8DF_CUrjTeCsQs7i9kxYeTRvb2Y5Pehim0vUz3E6-dQOBsS8GU&tn=DjnV9jP2VU2MGkWE&_nc_ht=scontent.fsgn17-1.fna&oh=00_AT99aTcS5l8cP24esRNz-4OEQEo2HVazs340ZihuT88nHA&oe=6297E998',
    roles: {
      'http://localhost:5500': 'dev-tools-admin'
    }
  },
  org: {
    domain: 'http://localhost:5500',
    name: 'dev tools',
    owner: 'nhatminh0509',
    slug: 'dev-tools'
  }
}

export default seedData