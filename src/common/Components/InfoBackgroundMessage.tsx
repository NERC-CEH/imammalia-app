import { ReactNode } from 'react';
import { observer } from 'mobx-react';
import { InfoBackgroundMessage } from '@flumens';
import appModel, { type Data } from 'models/app';

type Props = {
  name?: keyof Data;
  children: ReactNode;
};

const Message = ({ name, children, ...props }: Props) => {
  if (name && !appModel.data[name]) {
    return null;
  }

  const hideMessage = () => {
    appModel.data[name as keyof Data] = false;
    return {};
  };

  const onHide = name ? hideMessage : undefined;

  return (
    <InfoBackgroundMessage onHide={onHide} {...props}>
      {children}
    </InfoBackgroundMessage>
  );
};

export default observer(Message);
