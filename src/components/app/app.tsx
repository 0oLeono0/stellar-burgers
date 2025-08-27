import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes
} from 'react-router-dom';
import { create } from 'domain';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppHeader />}>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed'>
        <Route index element={<Feed />} />
        <Route
          path=':number'
          element={
            <Modal
              title={''}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            >
              <OrderInfo />
            </Modal>
          }
        />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/profile'>
        <Route index element={<Profile />} />
        <Route path='orders'>
          <Route index element={<ProfileOrders />} />
          <Route path=':number' element={<OrderInfo />} />
        </Route>
      </Route>
      <Route path='*' element={<NotFound404 />} />
      <Route
        path='/ingredients/:id'
        element={
          <Modal
            title={''}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
          >
            <IngredientDetails />
          </Modal>
        }
      />
    </Route>
  )
);
