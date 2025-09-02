import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getOrdersThunk,
  userOrdersSelector
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(userOrdersSelector);

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
