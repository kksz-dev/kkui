import * as React from "react";
import { cn } from "@/lib/utils";
import { message, useMessage, type MessageGlobalConfig, type MessageInstance } from "@/components/ui/message";
import {
  notification,
  useNotification,
  type NotificationGlobalConfig,
  type NotificationInstance,
} from "@/components/ui/notification";
import { Modal, useModal, type ModalHookApi } from "@/components/ui/modal";

/**
 * App — one provider that mounts the message / notification / modal context holders
 * and hands them out through `App.useApp()`, so those APIs run inside the React tree
 * instead of a detached root.
 */

export interface AppContextValue {
  message: MessageInstance;
  notification: NotificationInstance;
  modal: ModalHookApi;
}

/** Used when `useApp()` is called outside an `<App>` — falls back to the static APIs. */
const staticApis: AppContextValue = {
  message,
  notification,
  modal: {
    confirm: Modal.confirm,
    info: Modal.info,
    success: Modal.success,
    error: Modal.error,
    warning: Modal.warning,
  },
};

const AppContext = React.createContext<AppContextValue>(staticApis);

export interface AppProps {
  children?: React.ReactNode;
  /** Wrapper element, `false` renders children without any wrapper. */
  component?: React.ElementType | false;
  className?: string;
  style?: React.CSSProperties;
  /** Defaults for the message instance of this App. */
  message?: MessageGlobalConfig;
  /** Defaults for the notification instance of this App. */
  notification?: NotificationGlobalConfig;
}

export function App({
  children,
  component = "div",
  className,
  style,
  message: messageConfig,
  notification: notificationConfig,
}: AppProps) {
  const [messageApi, messageHolder] = useMessage(messageConfig);
  const [notificationApi, notificationHolder] = useNotification(notificationConfig);
  const [modalApi, modalHolder] = useModal();

  const value = React.useMemo<AppContextValue>(
    () => ({ message: messageApi, notification: notificationApi, modal: modalApi }),
    [messageApi, notificationApi, modalApi],
  );

  const content = (
    <>
      {messageHolder}
      {notificationHolder}
      {modalHolder}
      {children}
    </>
  );

  const Wrapper = component === false ? null : (component as React.ElementType);

  return (
    <AppContext.Provider value={value}>
      {Wrapper ? (
        <Wrapper data-slot="app" className={cn(className)} style={style}>
          {content}
        </Wrapper>
      ) : (
        content
      )}
    </AppContext.Provider>
  );
}

/** `const { message, notification, modal } = App.useApp()` */
export function useApp(): AppContextValue {
  return React.useContext(AppContext);
}

App.useApp = useApp;
