import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spacer } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as builtinServices from '../../../../../../services/translate';
import { PluginConfig } from '../../PluginConfig';
import { ServiceSourceType, getServiceName, getServiceSouceType, whetherPluginService } from '../../../../../../utils/service_instance';

export default function ConfigModal(props) {
    const { serviceInstanceKey, pluginList, isOpen, onOpenChange, updateServiceInstanceList } = props;

    const serviceSourceType = getServiceSouceType(serviceInstanceKey)
    const pluginServiceFlag = whetherPluginService(serviceInstanceKey)
    const serviceName = getServiceName(serviceInstanceKey)
    const builtin = builtinServices[serviceName];

    const { t } = useTranslation();
    const ConfigComponent = pluginServiceFlag ? PluginConfig : builtin?.Config;

    return pluginServiceFlag && !(serviceName in pluginList) ? (
        <></>
    ) : (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior='inside'
        >
            <ModalContent className='max-h-[75vh]'>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {serviceSourceType === ServiceSourceType.BUILDIN && builtin && (
                                <>
                                    <img
                                        src={builtin.info.icon}
                                        className='h-[24px] w-[24px] my-auto'
                                        draggable={false}
                                    />
                                    <Spacer x={2} />
                                    {t(`services.translate.${serviceName}.title`)}
                                </>
                            )}
                            {serviceSourceType === ServiceSourceType.BUILDIN && !builtin && (
                                <span>{t('config.service.builtin_removed') || 'This built-in service has been removed.'}</span>
                            )}
                            {pluginServiceFlag && (
                                <>
                                    <img
                                        src={pluginList[serviceName].icon}
                                        className='h-[24px] w-[24px] my-auto'
                                        draggable={false}
                                    />

                                    <Spacer x={2} />
                                    {`${pluginList[serviceName].display} [${t('common.plugin')}]`}
                                </>
                            )}
                        </ModalHeader>
                        <ModalBody>
                            {ConfigComponent && (
                            <ConfigComponent
                                name={serviceName}
                                instanceKey={serviceInstanceKey}
                                pluginType='translate'
                                pluginList={pluginList}
                                updateServiceList={updateServiceInstanceList}
                                onClose={onClose}
                            />
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color='danger'
                                variant='light'
                                onPress={onClose}
                            >
                                {t('common.cancel')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
