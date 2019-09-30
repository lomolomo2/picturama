import React from 'react'
import classnames from 'classnames'
import { Button, Classes } from '@blueprintjs/core'

import { msg } from 'common/i18n/i18n'
import { bindMany } from 'common/util/LangUtil'
import { PhotoWork } from 'common/CommonTypes'

import RotateButtonGroup from 'app/ui/widget/RotateButtonGroup'
import Toolbar from 'app/ui/widget/Toolbar'
import { rotate } from 'common/util/EffectsUtil'


export interface Props {
    className?: any
    photoWork: PhotoWork | null
    onPhotoWorkChange(photoWork: PhotoWork): void
    onDone(): void
}

export default class CropModeToolbar extends React.Component<Props> {

    constructor(props: Props) {
        super(props)
        bindMany(this, 'onRotate')
    }

    private onRotate(turns: number) {
        const prevPhotoWork = this.props.photoWork
        if (prevPhotoWork) {
            const photoWork = { ...prevPhotoWork }
            rotate(photoWork, turns, true)
            this.props.onPhotoWorkChange(photoWork)
        }
    }

    render() {
        const { props } = this
        return (
            <Toolbar className={classnames(props.className, 'CropModeToolbar')} isLeft={true}>
                <span className='pull-right'>
                    <RotateButtonGroup disabled={!props.photoWork} onRotate={this.onRotate}/>
                    <Button
                        intent='success'
                        onClick={props.onDone}
                    >
                        <span className={Classes.BUTTON_TEXT}>{msg('CropModeToolbar_done')}</span>
                    </Button>
                </span>
            </Toolbar>
        )
    }

}