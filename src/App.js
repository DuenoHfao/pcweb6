import { createBrowserRouter,RouterProvider } from "react-router-dom";
import PostPageHome from "./views/PostPageHome";
import LoginPage from "./views/LoginPage";
import SignUpPage from "./views/SignUpPage";
import PostPageAdd from "./views/PostPageAdd";
import PostPageDetail from "./views/PostPageDetail";
import PostPageUpdate from "./views/PostPageUpdate";

function App() {

  const router = createBrowserRouter([
    {path:"/", element: <PostPageHome />},
    {path: "/add", element: <PostPageAdd />},
    {path: "/login", element: <LoginPage />},
    {path: "/signup", element: <SignUpPage />},
    {path: "/post/:id", element: <PostPageDetail />},
    {path: "/update/:id", element: <PostPageUpdate />}
  ])

  return (
    <RouterProvider router = {router}></RouterProvider>
  );
}

export default App;
