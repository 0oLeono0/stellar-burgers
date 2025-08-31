import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  burgerConstructorSelector,
  clearBurgerConstructor
} from '../../services/slices/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  isOrderLoadingSelector,
  orderSelector
} from '../../services/slices/feedSlice';
import { useNavigate } from 'react-router-dom';
import { isAuthSelector } from '../../services/slices/userSlice';
import { clearOrder, orderBurgerThunk } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(burgerConstructorSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData = useSelector(orderSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector(isAuthSelector);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
    }

    const { bun, ingredients } = constructorItems;
    if (!bun || orderRequest) return;
    const orderData = [
      bun._id!,
      ...ingredients.map((ingredient) => ingredient._id!)
    ];
    dispatch(orderBurgerThunk(orderData));
  };

  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(clearOrder());
    dispatch(clearBurgerConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
