
import { createContext, useContext } from 'react';

export type ShowModalType = 'add' | 'edit'

type DialogContextType = {
  /**
   * 打开新增对话弹窗
   * @param {ShowModalType} type
   */
  showModal?: (type: ShowModalType) => void
  /**
   * 删除对话
   * @param {number} id
   */
  removeDialog?: (id: number) => void
}

/**
 * 对话context
 */
export const DialogContext = createContext<DialogContextType>({
  showModal: () => { },
  removeDialog: () => { }
});

/**
 * 对话context use
 * @returns
 */
export const useDialogContext = () => {
  const ctx = useContext(DialogContext);

  return ctx;
};
