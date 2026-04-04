# NostalgiaNet

NostalgiaNet is a unique digital platform designed as a time capsule. It allows users to securely store images, videos, and other multimedia content for varying amounts of time, preserving their memories for future retrieval and sharing.

---

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation and Setup](#installation-and-setup)
4. [Usage](#usage)
5. [Development Workflow](#development-workflow)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)

---

## Features

- **Time Capsule:** Store and retrieve multimedia content based on specific time periods.
- **User Authentication:** Secure login system using Firestore Authentication.
- **Custom Profiles:** Personalized user profiles with friend systems.
- **Journals:** Create collaborative journals with friends, combining multimedia and textual entries.
- **Storage Options:** Integrates Firebase Realtime Database for efficient data storage.
- **SEO Optimized:** Designed for high visibility, focusing on keywords like `timevault`.
- **Mobile Optimization:** Built with Next.js for a seamless mobile experience.
- **Secure Notifications:** Handle friend requests and updates using a secure notification system.

---

## Technologies Used

### Frontend:
- React.js
- Next.js (for SEO and mobile optimization)

### Backend:
- Firebase Authentication
- Firebase Realtime Database
- Cloudflare Worker (for server-side functions)

### Tools:
- FilePond / Dropzone.js (for file uploads)
- Docker (for containerized development)

---

## Installation and Setup

### Prerequisites:
- Node.js (>=16.x)
- Firebase CLI

### Steps:
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/andycandy/NostalgiaNet-ClientCode.git
   cd nostalgianet
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Firebase:**
   - Initialize Firebase in your project:
     ```bash
     firebase init
     ```
   - Configure Authentication and Realtime Database.

4. **Run the Application Locally:**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

5. **Deploy:**
   - Build the project:
     ```bash
     npm run build
     ```
   - Deploy using your preferred method (Vercel, Docker, etc.).

---

## Usage

1. **Create an Account:**
   Sign up using your email or third-party login options.

2. **Store Memories:**
   Upload images or videos, setting time periods for retrieval.

3. **Collaborate:**
   Use journals to collaborate with friends, sharing thoughts, memories, and multimedia.


---

## Development Workflow

### Branching Strategy:
- **Main:** Production-ready code.
- **Dev:** Active development.
- **Feature:** New feature development.

### Common Commands:
- Start development server:
  ```bash
  npm run dev
  ```
- Lint code:
  ```bash
  npm run lint
  ```
- Run tests:
  ```bash
  npm test
  ```

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit changes and push:
   ```bash
   git commit -m "Add new feature"
   git push origin feature/your-feature-name
   ```
4. Open a Pull Request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or support, please reach out to:
- **Email:** support@nostalgianet.com
- **GitHub Issues:** [Issues Page](https://github.com/andycandy/NostalgiaNet-ClientCode/issues)
- **Social Media:** Follow us on Twitter [@nostalgianet](https://twitter.com/nostalgianet)

---

**NostalgiaNet - Your Memories, Secured.**

