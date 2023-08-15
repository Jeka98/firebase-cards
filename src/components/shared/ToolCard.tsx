import { useState } from "react";
import { Tool, InputEnum } from "../screens/Index";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from "clsx";

interface ToolCardProps {
    tool: Tool,
    onUpdate: (data: Partial<Tool>) => void,
    onDelete: (data: Partial<Tool>) => void,
}

const ToolCard = ({ tool, onUpdate, onDelete }: ToolCardProps) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [inputData, setInputData] = useState<Partial<Tool>>(tool);

    const toggleIsEdit = () => setIsEdit(prevIsEdit => !prevIsEdit);

    const onClose = () => {
        setIsEdit(false);
        setInputData(tool);
    }

    const handleInputChange = (field: InputEnum, value: string) => {
        setInputData({ ...inputData, [field]: value });
    }

    const handleUpdate = () => {
        setIsEdit(false);
        onUpdate(tool.id, inputData);
    }

    const handleDelete = () => {
        onDelete(tool.id, inputData);
    }

    const inputClasses = clsx(
        'cursor-default',
        'py-2',
        'px-4',
        'rounded-md'
    )

    return (
        <tr key={tool.id}>
            <td className="bg-slate-800 border border-slate-700">
                {
                    isEdit ?
                        <input
                            value={inputData.title}
                            className={clsx(inputClasses, {
                                'bg-gray-900': isEdit,
                                'cursor-pointer': isEdit
                            })}
                            onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
                        />
                        :
                        inputData.title
                }
            </td>

            <td className="bg-slate-800 border border-slate-700">
                {
                    isEdit ?
                        <input
                            value={inputData.description}
                            className={clsx(inputClasses, {
                                'bg-gray-900': isEdit,
                                'cursor-pointer': isEdit
                            })}
                            onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
                        />
                        :
                        inputData.description
                }
            </td>

            <td className="bg-slate-800 border border-slate-700">
                {
                    isEdit ?
                        <input
                            value={inputData.url}
                            className={clsx(inputClasses, {
                                'bg-gray-900': isEdit,
                                'cursor-pointer': isEdit
                            })}
                            onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
                        />
                        :
                        inputData.url
                }
            </td>
            <td className="bg-slate-800 border border-slate-700">
                {
                    isEdit ?
                        <>
                            <button className="btn mr-2" onClick={handleUpdate}>
                                <CheckIcon className="h-6 w-6 text-slate-50" />
                            </button>
                            <button className="btn" onClick={onClose}>
                                <XMarkIcon className="h-6 w-6 text-slate-50" />
                            </button>
                        </> :
                        <>
                            <button className="btn mr-2" onClick={toggleIsEdit}>
                                <PencilIcon className="h-6 w-6 text-slate-50" />
                            </button>
                            <button className="btn" onClick={handleDelete}>
                                <TrashIcon className="h-6 w-6 text-slate-50" />
                            </button>
                        </>
                }
            </td>
        </tr>
    )
}

export default ToolCard;