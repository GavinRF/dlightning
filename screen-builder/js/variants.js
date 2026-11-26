// VARIANTS // add es6-string-hmtl plugin to see text highlighting with /*html*/
// class="non-editable"  -> text that should not be editable
// class="icon-container"  -> give the icon a picker
// class="heading-wrapper" -> make it adhere to heading styles
// .nav-image or .card-image -> upload an image into it
// wrap <p> and <h1-6> in <div> to make the alignment controls appear above
// background colors var(--color-* to trigger color swatches and text contrast
// data-no-carry -> this text keeps its own copy when switching variants (never receives or shares carried-over edits)
function setupVariants(type) {
switch(type) {
    case 'alert':
        return [
        // Info Default Original
        /*html*/
        `<div class="alert-con">
            <div style="background-color: #3498db;" class="alert-body">
                <div style="display: flex;">
                    <div class="icon-container alert-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                        <span class="usa" contenteditable="true"> Info message.</span>
                </div>
                <i class="fas fa-close"></i>
            </div>
        </div>`,
        // Success - alert 
        /*html*/
        `<div class="alert-con">
            <div style="background-color: #27ae60;" class="alert-body">
                <div style="display: flex;">
                    <div class="icon-container alert-icon">
                        <i class="fas fa-circle-check"></i>
                    </div>
                    <span class="fw usa" contenteditable="true">Success message!</span>
                </div>
                <i class="fas fa-close"></i>
            </div>
        </div>`,
        // Warning - alert
        /*html*/
        `<div class="alert-con">
            <div style="background-color: #f39c12;" class="alert-body">
                <div style="display: flex;">
                    <div class="icon-container alert-icon">
                        <i class="fas fa-triangle-exclamation"></i>
                    </div>
                    <span class="fw usa" contenteditable="true">Warning message!</span>
                </div>
                <i class="fas fa-close"></i>
            </div>
        </div>`,
        // error - alert
        /*html*/
        `<div class="alert-con">
            <div style="background-color: var(--error-danger-delete);" class="alert-body">
                <div style="display: flex;">
                    <div class="icon-container alert-icon">
                        <i class="fas fa-circle-exclamation"></i>
                    </div>
                    <span class="fw usa" contenteditable="true">Error message.</span>
                </div>
                <i class="fas fa-close"></i>
            </div>
        </div>`,
        // theme color - alert
        /*html*/
        `<div class="alert-con">
            <div style="background-color: var(--color-primary);" class="alert-body">
                <div style="display: flex;">
                    <div class="icon-container alert-icon">
                        <i class="fas fa-bolt-lightning"></i>
                    </div>
                    <span class="fw usa" contenteditable="true">Theme color background!</span>
                </div>
                <i class="fas fa-close"></i>
            </div>
        </div>`,
        // dark - alert
        /*html*/
        `<div class="alert-con">
            <div style="background-color: #34495e;" class="alert-body">
                <span class="fw usa" contenteditable="true">Dark message.</span>
                <i class="fas fa-close"></i>
            </div>
        </div>`,
        ];

/// avatar avatar: avatar- // / /
    case 'avatar':
        return [
        // Basic Text Default Original - avatar
        /*html*/
        `<div class="usa" spellcheck="false" contenteditable="true" style="margin: 2px 0; width: 40px; height: 40px; background-color: var(--color-primary); color: var(--basic-txt-color); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; text-align: center;">
                AV
            </div>
            <div class="avatar-column">
                <span contenteditable="true" class="usa avatar-text">Display Name</span>
                <span contenteditable="true" class="usa avatar-sub-txt">location</span>
            </div>`,
        // Small Text - avatar
        /*html*/
        `<div class="fw">
        <div class="align-content avatar-inner">
            <div class="avatar-small avatar-base usa" style="background-color: var(--color-primary);">
                A
            </div>
            <div class="avatar-column">
                <span class="avatar-text usa">Display Name</span>
            </div>
        </div>
        </div>`,
        // IMG - avatar smaller
         /*html*/
         `<div class="fw">
         <div class="align-content avatar-inner">
            <div class="nav-image avatar-img-small">
                <i style="color: var(--placeholder-color); font-size: smaller; pointer-events: none;" class="fa-solid fa-image non-editable"></i>
            </div>
            <div class="avatar-column">
                <span contenteditable="true" class="avatar-text usa">Display Name</span>
            </div>
        </div>
        </div>`,
        // Squareish - avatar
        /*html*/
        `<div class="fw">
        <div class="align-content avatar-inner">
            <div class="avatar-squareish avatar-base" style="background-color: var(--color-primary);">
                AV
            </div>
            <div class="avatar-column">
                <span contenteditable="true" class="avatar-text usa">Display Name</span>
                <span contenteditable="true" class="avatar-sub-txt usa">location</span>
            </div>
        </div>
        </div>`,
        // User Icon - avatar
        /*html*/
        `<div class="fw">
        <div class="align-content avatar-inner">
            <div class="icon-container avatar-base avatar-icon" style="background-color: var(--color-primary);">
                <i class="fas fa-user"></i>
            </div>
            <div class="avatar-column">
                <span contenteditable="true" class="avatar-text usa">Display Name</span>
            </div>
        </div>
        </div>`,
        // Outline - avatar
        /*html*/
        `<div class="fw">
        <div class="align-content avatar-inner">
            <div class="avatar-base avatar-outline" style="color: var(--color-primary); border: .12rem solid var(--color-primary);">
                AV
            </div>
            <div class="avatar-column">
                <span contenteditable="true" class="avatar-text usa">Display Name</span>
                <span contenteditable="true" class="avatar-sub-txt usa">location</span>
            </div>
        </div>
        </div>`,
        // IMG - avatar larger  - double stack
        /*html*/
        `<div class="fw">
            <div class="align-content avatar-inner">
                <div class="nav-image avatar-img avatar-base">
                <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
                <div class="avatar-column">
                <span contenteditable="true" class="avatar-text usa">Display Name</span>
                <span contenteditable="true" class="avatar-sub-txt usa">@username</span>
                </div>
            </div>
        </div>`,
        //verified checkmark avatar
        /*html*/
        `<div class="success-container fw">
            <div class="align-content avatar-inner">
                <div style="position: relative;">
                <div class="nav-image avatar-img avatar-base">
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
                <div class="icon-container avatar-checkmark" style="background-color: var(--color-primary);">
                    <i class="fas fa-check" style="color: var(--basic-txt-color); font-size: 10px;"></i>
                </div>
                </div>
                <div class="avatar-column">
                <span contenteditable="true" class="avatar-text usa">Display Name</span>
                </div>
            </div>
        </div>`,
        //Badge Avatar
        /*html*/
        `<div class="error-container fw">
            <div class="align-content avatar-inner">
                <div style="position: relative;">
                <div class="nav-image avatar-img avatar-base">
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
                <div class="icon-container avatar-badge" style="background-color: var(--color-primary);">
                    <i class="fa-solid fa-3"style="color: var(--basic-txt-color); font-size: 11px;"></i>
                </div>
                </div>
                <div class="avatar-column">
                <span contenteditable="true" class="avatar-text usa">Display Name</span>
                </div>
            </div>
        </div>`,
        //AVATAR Group // Group avatars with +3
        /*html*/
        `<div class="fw success-container">
        <div class="align-content hero avatar-inner">
        <div class="avatar-group-con">
            <div class="card-image avatar-group-image">
            <i class="fa-solid fa-image image-ph non-editable"></i>
            </div>
            <div class="card-image avatar-group-image">
            <i class="fa-solid fa-image image-ph non-editable"></i>
            </div>
            <div class="card-image avatar-group-image">
            <i class="fa-solid fa-image image-ph non-editable"></i>
            </div>
            <div class="card-image avatar-group-image">
            <i class="fa-solid fa-image image-ph non-editable"></i>
            </div>
            <div class="avatar-group-number" style="background-color: var(--color-primary);">
            <span class="avatar-text">+3</span>
            </div>
        </div>
        <div>
            <span contenteditable="true" class="avatar-text usa">Group</span>
        </div>
        </div>
        </div>`,
        // Contact - avatar with phone number + call button (the prototype player dials it
        // on a phone-dialer keyboard: .avatar-contact / .avatar-phone / .avatar-call)
        /*html*/
        `<div class="fw">
            <div class="align-content avatar-inner avatar-contact" style="width: 100%;">
                <div class="nav-image avatar-img avatar-base">
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
                <div class="avatar-column" style="flex: 1; min-width: 0;">
                    <span contenteditable="true" class="avatar-text usa">Display Name</span>
                    <span contenteditable="true" class="avatar-sub-txt usa avatar-phone">(555) 123-4567</span>
                </div>
                <div class="icon-container avatar-call" style="background-color: var(--color-primary); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="fas fa-phone-alt" style="font-size: 14px;"></i>
                </div>
            </div>
        </div>`
        ];

/// button button: button-
    case 'button':
        return [
        // Button Default Original
        /*html*/
        `<div class="ui-button-container">
            <div class="ui-button">
                <div role="button" class="ui-button usa" contenteditable="true" style="background-color: var(--color-primary);">
                    BUTTON
                </div>
            </div>
        </div>`,
        //Button with Icon Left
        /*html*/
        `<div class="ui-button-container">
            <div class="ui-button">
                <div role="button" class="ui-button" style="background-color: var(--color-primary);">
                <div contenteditable="false" class="icon-container" style="display: inline; margin: 0 6px 0 0;">
                    <i  contenteditable="false" class="fas fa-hand-point-right" style="font-size: 18px;"></i>
                </div>
                <div class="usa" contenteditable="true" style="display: inline; margin: 0 0 0 6px;">
                    BUTTON
                </div>
                </div>
            </div>
        </div>`,
         //Button with Icon Right
         /*html*/
         `<div class="ui-button-container">
            <div class="ui-button">
                <div role="button" class="ui-button usa" style="background-color: var(--color-primary);">
                <div class="usa" contenteditable="true" style="display: inline; margin: 0 6px 0 0;">
                    BUTTON
                </div>
                <div contenteditable="false" class="icon-container" style="display: inline; margin: 0 0 0 6px;">
                    <i  contenteditable="false" class="fas fa-hand-point-left" style="font-size: 18px;"></i>
                </div>
                </div>
            </div>
        </div>`,
        // Ghost Button
        /*html*/
        `<div class="ui-button-container">
            <div class="ui-button">
                <div role="button" class="ui-button usa" contenteditable="true" style="background-color: transparent; color: var(--color-primary); border: 2px solid var(--color-primary);">
                    GHOST BUTTON
                </div>
            </div>
        </div>`,
        // Double Button
        /*html*/
        `<div class="ui-button-container">
            <div class="ui-button">
            <div role="button" class="ui-button usa" contenteditable="true" style="background-color: transparent; color: var(--color-primary); border: 2px solid var(--color-primary);">
                CANCEL
            </div>
            <div role="button" class="ui-button usa" contenteditable="true" style="background-color: var(--color-primary);">
                ACCEPT
            </div>
            </div>
        </div>`,
        // Single Circle Button
        /*html*/
        `<div class="circle-button-container">
        <button class="circle-button icon-container" style="background-color: var(--color-primary);">
            <i class="fas fa-plus"></i>
        </button>
        <span class="circle-button-label usa">Label</span>
        </div>`,

        // Disabled
        /*html*/
        `<div class="ui-button-container">
            <div class="ui-button">
                <div role="button" class="ui-button usa" contenteditable="true" style="background-color: var(--color-primary); opacity: 0.5;">
                    DISABLED BUTTON
                </div>
            </div>
        </div>`,
        // Button Group
        /*html*/
        `<div class="ui-button-container">
            <div style="display: flex;">
                <div role="button" class="ui-button usa" contenteditable="true" style="background-color: var(--color-primary); border-radius: 24px 0 0 24px;">
                    Left
                </div>
                <div role="button" class="ui-button usa button-group-middle" contenteditable="true" style="background-color: var(--color-primary);">
                    Middle
                </div>
                <div role="button" class="ui-button usa" contenteditable="true" style="background-color: var(--color-primary); border-radius: 0 24px 24px 0;">
                    Right
                </div>
            </div>
        </div>`,
        // Gradient BTN
        /*html*/
        `<div class="ui-button-container">
            <div class="ui-button">
                <div role="button" class="ui-button usa" contenteditable="true" style="background: linear-gradient(45deg, var(--color-primary), var(--color-accent)); color: var(--text-on-primary);">
                    GRADIENT BUTTON
                </div>
            </div>
        </div>`,
        // Button with border radius
        /*html*/
        `<div class="ui-button-container">
            <div class="ui-button">
                <div role="button" class="ui-button usa" contenteditable="true" style="background-color: var(--color-primary); border-radius: var(--standard-radius);">
                    Theme Radius
                </div>
            </div>
        </div>`
        ];

// BLANK CARD // //
case 'blankCard':
    return [
        // Default
        /*html*/
        `<div class="fw">
            <div class="blank-card-content" style="border-bottom: 0.12rem solid var(--neutral-gray);background-color: var(--input-bg-color);"></div>
        </div>`,

        // primary color background
        /*html*/
        `<div class="fw">
            <div class="blank-card-content" style="background-color: var(--color-transparent-blk);"></div>
        </div>`,
        
        // Accent border
        /*html*/
        `<div class="fw">
            <div class="blank-card-content border-card" style="border: 0.12rem solid var(--color-primary);"></div>
        </div>`,

        // Gradient background
        /*html*/
        `<div class="fw">
            <div class="blank-card-content" style="background: linear-gradient(45deg, var(--color-primary), var(--color-accent)); "></div>
        </div>`,

        // image background
        /*html*/
        `<div class="fw">
            <div class="blank-card-content hero" style="position: relative; background-color: var(--input-bg-color); z-index: 4;">
            <div class="card-image non-editable blank-w-image">
            <span class="non-editable" style="color: gray;">Click to add image</span>
            <i style="color: var(--placeholder-color);" class="fa-solid fa-image"></i>
            </div>
            </div>
        </div>`,
    ];

/// card card: card- imgCard
    case 'card':
        return [
            // Default Card
            /*html*/
            `<div class="card-con">
            <div class="card-image card-img-placeholder resizeable">
                <i class="fa-solid fa-image image-ph non-editable"></i>
                <span class="non-editable">click to add image</span>
            </div>
            <div class="card-content">
                <div>
                <h3 class="card-title usa">Card Title</h3>
                </div>
                <div>
                <p class="card-text usa">Card content goes here. This is a brief description.</p>
                </div>
            </div>
            </div>`,

            // Feature Card
            /*html*/
            `<div class="card-con">
            <div class="card-image card-img-placeholder resizeable" style="height: 146px;">
                <i class="fa-solid fa-image image-ph non-editable"></i>
                <span class="non-editable">Click to add image</span>
            </div>
            <div class="card-content">
                <span class="card-featured-tag" style="color: var(--color-primary);">Featured</span>
                <div>
                <h3 class="card-title usa">Featured Card</h3>
                </div>
                <div>
                <p class="card-text usa">A more detailed card description, perfect for highlighting important content.</p>
                </div>
                <div class="card-button usa" style="background-color: var(--color-primary); color: var(--basic-txt-color);">Read More</div>
            </div>
            </div>`,

            // Horizontal Card Left
            /*html*/
            `<div class="card-con card-hz">
            <div class="card-image card-hz-img-lft">
                <i class="fa-solid fa-image image-ph non-editable"></i>
            </div>
            <div class="card-hz-content">
                <div>
                <h3 class="card-title usa">Horizontal Card</h3>
                </div>
                <div>
                <p class="card-text usa">Perfect for list views and compact layouts.</p>
                </div>
            </div>
            </div>`,

            // Horizontal Card Right
            /*html*/
            `<div class="card-con card-hz">
            <div class="card-hz-content">
                <div>
                <h3 class="card-title usa">Horizontal Card</h3>
                </div>
                <div>
                <p class="card-text usa">Perfect for list views and compact layouts.</p>
                </div>
            </div>
            <div class="card-image card-hz-img-rgt">
                <i class="fa-solid fa-image image-ph non-editable"></i>
            </div>
            </div>`,

            // Social Card
            /*html*/
            `<div class="card-con">
            <div class="card-image card-img-placeholder resizeable" style="height: 166px;">
                <i class="fa-solid fa-image image-ph non-editable"></i>
                <span class="non-editable">Click to add image</span>
            </div>
            <div class="card-content">
                <div class="card-social-header">
                <div class="nav-image card-avatar">
                    <i class="fa-solid fa-image non-editable" style="font-size: smaller;"></i>
                </div>
                <div>
                    <div class="card-social-name usa" style="color: var(--color-secondary);">Display Name</div>
                    <div class="card-social-time usa">2 hours ago</div>
                </div>
                </div>
                <div>
                <p class="card-text usa">A social media style card with user avatar and timestamp.</p>
                </div>
                <div class="card-social-actions">
                <span class="icon-container"><i class="fas fa-heart"></i>&emsp;<div class="usa" style="display: inline;">24</div></span>
                <span class="icon-container"><i class="fas fa-comment"></i>&emsp;<div class="usa" style="display: inline;">3</div></span>
                <span class="icon-container"><i class="fas fa-share-nodes"></i></span>
                </div>
            </div>
            </div>`,

            // Product Card
            /*html*/
            `<div class="card-con">
            <div class="card-image card-img-placeholder resizeable">
                <i class="fa-solid fa-image image-ph non-editable"></i>
                <span class="non-editable">Click to add image</span>
            </div>
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <div>
                    <h3 data-no-carry class="card-title usa">Product Name</h3>
                    </div>
                    <div>
                    <p class="card-text usa">Brief product description highlighting key features.</p>
                    </div>
                </div>
                <div style="color: var(--color-primary); font-size: 20px; font-weight: bold;">$99</div>
                </div>
                <div style="display: flex; gap: 8px;">
                <div class="card-button usa" style="flex: 1; background-color: var(--color-primary);">Add to Cart</div>
                <div class="card-button" style="flex: 0 0 auto; background-color: var(--neutral-gray);"><i style="color: var(--error-danger-delete);" class="fas fa-heart"></i></div>
                </div>
            </div>
            </div>`,

            // Event Card
            /*html*/
            `<div class="card-con">
            <div style="position: relative;">
            <div class="card-image card-img-placeholder resizeable">
                <i class="fa-solid fa-image image-ph non-editable"></i>
                <span class="non-editable">Click to add image</span>
            </div>
            <div style="position: absolute; top: 12px; right: 12px; background-color: var(--color-primary); padding: 8px; border-radius: 8px; text-align: center;">
                <div class="usa" style="color: var(--basic-txt-color); font-size: 20px; font-weight: bold;">15</div>
                <div class="usa" style="color: var(--basic-txt-color); font-size: 14px;">MAR</div>
            </div>
            </div>
            <div class="card-content">
            <div>
            <h3 data-no-carry class="card-title usa">Event Title</h3>
            </div>
            <div style="display: flex; gap: 12px; margin: 8px 0; color: var(--basic-txt-color);">
                <span class="icon-container"><i class="fas fa-clock"></i><div class="usa" style="display: inline;"> 7:00 PM</div></span>
                <span class="icon-container"><i class="fas fa-location-dot"></i><div class="usa" style="display: inline;"> Location Name</div></span>
            </div>
            <div>
            <p class="card-text usa">Brief description of the event and what attendees can expect.</p>
            </div>
            <div style="display: flex; gap: 8px;">
                <div class="card-button usa" style="flex: 1; background-color: var(--color-primary); color: var(--basic-txt-color);">Register Now</div>
                <div class="card-button usa" style="flex: 1; background-color: var(--neutral-gray); color: var(--basic-txt-color);">Learn More</div>
            </div>
            </div>
            </div>`,

            // Updated Stacked Image Card
            /*html*/
            `<div class="card-con card-stacked">
                <div class="card-image card-img-placeholder card-stacked-img resizeable bb">
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                    <span class="non-editable">Click to add image</span>
                </div>
                <div class="card-content card-stacked-content">
                <div>
                    <h3 class="card-title usa">Elevated Design</h3>
                    </div>
                    <div>
                    <p class="card-text usa">Layout with an elevated image.</p>
                    </div>
                    <div class="card-actions error-container">
                        <div class="card-social-actions">
                        <span class="icon-container"><i class="fas fa-heart" style="color: var(--color-primary);"></i><div class="usa" style="display: inline;"> 42</div></span>
                        <span class="icon-container"><i class="fas fa-bookmark"></i></span>
                        </div>
                    </div>
                </div>
            </div>`,

            // Bottom Image Card
            /*html*/
            `<div class="card-con">
                <div class="card-content">
                <div>
                <h3 class="card-title usa">Bottom Image Design</h3>
                </div>
                <div>
                <p class="card-text usa">Layout with the image placed at the bottom, perfect for when you want the text to grab attention first.</p>
                </div>
                <div class="card-metrics">
                    <span class="icon-container"><i class="fas fa-star" style="color: var(--color-primary);"></i>&emsp;&nbsp;<div class="usa" style="display: inline;">4.8</div></span>
                    <span class="icon-container"><i class="fas fa-eye" style="color: var(--color-primary);"></i>&emsp;&nbsp;<div class="usa" style="display: inline;">1.2k</div></span>
                </div>
                </div>
                <div class="card-image card-img-placeholder resizeable card-image-bottom">
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                    <span class="non-editable">Click to add image</span>
                </div>
            </div>`,
        ];

/// card2 card2: card2- text-card 
        case 'card2':
            return [
            // Simple Card
            /*html*/
            `<div class="card-con">
            <div class="card-simple">
            <div class="card-icon-header">
                <div class="icon-container card-icon-large" style="color: var(--color-primary);">
                <i class="fas fa-bolt"></i>
                </div>
                <div style="width: 100%;">
                <h3 class="card-title usa">Simple Card</h3>
                </div>
            </div>
            <div>
            <p class="card-text usa">A minimalist card with icon.</p>
            </div>
            </div>
            </div>`,

            // Color Card
            /*html*/
            `<div class="card-con" style="background-color: var(--color-accent); border: none;">
                <div class="card-simple" style="display: flex; justify-content: space-between;">
                    <div style="width: 100%; margin-right: 14px;">
                        <div>
                        <h3 class="card-title usa">Color Card</h3>
                        </div>
                        <div>
                        <p class="card-text usa">A minimalist card with icon.</p>
                        </div>
                    </div>
                    <div class="icon-container card-icon-large" style="color: var(--color-primary);">
                        <i class="fas fa-bolt"></i>
                    </div>
                </div>
            </div>`,

            // Action Card
            /*html*/
            `<div class="card-con">
                <div class="card-simple">
                  <div>
                  <h3 class="card-title usa card-centered">Action Card</h3>
                  </div>
                  <div>
                  <p class="card-text usa card-centered">A card with multiple action buttons.</p>
                  </div>
                    <div class="card-action-buttons">
                        <div class="card-action-btn usa" style="background-color: var(--color-primary);">
                        <span>Accept</span>
                        </div>
                        <div class="card-action-btn usa" style="border: 1px solid var(--color-primary); color: var(--color-primary);">
                        <span>Decline</span>
                        </div>
                    </div>
                </div>
            </div>`,

            // Info Card
            /*html*/
            `<div style="background-color: var(--secondary-color);">
                <div class="card-con" style="background-color: var(--neutral-gray);">
                    <div class="card-simple">
                        <div>
                        <h4 class="card-title usa">Informational Card</h4>
                        </div>
                        <div>
                        <p class="card-text usa" style="font-size: 14px;">
                        Use this card to display detailed information in an organized manner.
                        </p>
                        </div>
                    </div>
                </div>
            </div>`,

            // Quote Card
            /*html*/
            `<div class="card-con">
                <div class="card-quote">
                    <div class="card-quote-text heading-wrapper">
                        <h4 class="usa" contenteditable="true">
                        <span style="margin-left: -12px;">"&hairsp;</span><span class="usa">Quote card, designed to display text with impact.</span>&hairsp;"
                        </h4>
                    </div>
                    <div class="card-quote-author">
                        <p class="usa">— Author Name</p>
                    </div>
                </div>
            </div>`,

            // Checklist Card
            /*html*/
            `<div class="card-con">
                <div class="card-simple">
                    <div>
                    <h3 class="card-title usa">List Card</h3>
                    </div>
                    <ol class="card-list">
                        <li class="usa">Task or goal</li>
                        <li class="usa">Task or goal</li>
                        <li class="usa">Task or goal</li>
                    </ol>
                </div>
            </div>`,

            // Statistic Card
            /*html*/
            `<div class="card-stats">
                <div class="card-stat-header">
                    <div class="icon-container">
                      <i class="fa-solid fa-chart-line" style="color: var(--color-primary)"></i>
                    </div>
                    <div>
                    <h1>95%</h1>
                    </div>
                </div>
                <div>
                <p class="card-text">User Satisfaction</p>
                </div>
            </div>`,

            // Progress Update Card
            /*html*/
            `<div class="card-con card-simple">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div>
                        <h3 class="card-title usa">Project Status</h3>
                        </div>
                        <div>
                        <p class="card-text usa">Current sprint progress</p>
                        </div>
                    </div>
                    <span style="color: var(--color-primary);">75%</span>
                </div>
            </div>`,

            // Achievement Card
            /*html*/
            `<div class="card-con" style="background-color: var(--color-primary)">
                <div class="card-centered">
                <div class="achievement-con">
                    <div class="achievement-layer-1"></div>
                    <div class="achievement-layer-2"></div>
                    <div class="achievement-content">
                    <div class="icon-container card-icon-large" style="margin: 6px 0 10px 0;">
                        <i class="fas fa-trophy" style="color: var(--color-accent);"></i>
                    </div>
                    <div>
                    <h3 class="card-title usa">Level Achieved!</h3>
                    </div>
                    <div>
                    <p class="card-text usa">You've reached Level 5</p>
                    </div>
                    <div>
                    <p class="usa" style="font-size: 12px; margin-top: 8px;">75/100 XP to next level</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>`,

            // Support Card
            // /*html*/
            // `<div class="card-con card-simple">
            //     <div style="text-align: center; padding: 10px 0;">
            //         <div class="icon-container card-icon-large" style="margin-bottom: 4px;">
            //             <i class="fas fa-headset" style="color: var(--color-primary);"></i>
            //         </div>
            //         <div>
            //         <h3 class="card-title usa">Need Help?</h3>
            //         </div>
            //         <div>
            //         <p class="card-text usa">Our support team is here 24/7</p>
            //         </div>
            //         <div class="card-action-buttons" style="margin-top: 12px;">
            //             <div class="card-action-btn" style="background-color: var(--color-primary);">
            //                 <div class="icon-container">
            //                 <i class="fas fa-message"></i>
            //                 </div>
            //                 <span style="margin-left: 8px;">Chat Now</span>
            //             </div>
            //         </div>
            //     </div>
            //     <div style="border-top: 1px solid var(--neutral-gray); margin: 8px 0 0 0; text-align: center;">
            //         <p class="usa card-time">Average response time: <strong>2 mins</strong></p>
            //     </div>
            // </div>`,

            // Resource Card
            // /*html*/
            // `<div class="card-con card-link">
            //     <div class="card-simple">
            //         <div style="position: relative;">
            //             <div class="icon-container card-icon-large" style="color: var(--color-primary); margin-bottom: 12px;">
            //             <i class="fas fa-file-pdf"></i>
            //             </div>
            //             <div class="card-badge success-container" style="background-color: var(--color-primary);">3</div>
            //         </div>
            //       <div>
            //       <h3 class="card-title usa">Documentation</h3>
            //       </div>
            //       <div>
            //       <p class="card-text usa">Download project documentation and guides</p>
            //       </div>
            //         <div class="card-metrics">
            //             <span class="icon-container"><i class="fas fa-download"></i><div class="usa" style="display: inline;"> 128</div></span>
            //             <span class="usa" style="font-size: 14px;">2.4 MB</span>
            //         </div>
            //     </div>
            // </div>`,
        
        ];

/// listItem listItem: listItem-
        case 'listItem':
            return [
                // Basic list item
                /*html*/
                `<div class="li-base li-padding-x" style="background-color: var(--input-bg-color);">
                    <div class="icon-container li-icon">
                        <i class="fas fa-bolt-lightning" style="color: var(--color-primary);"></i>
                    </div>
                    <span class="usa" contenteditable="true">List item text</span>
                </div>`,
        
                // Simple top border style
                /*html*/
                `<div class="li-base li-padding-x li-border-top">
                    <div class="icon-container li-icon">
                        <i class="fas fa-bolt-lightning" style="color: var(--color-primary);"></i>
                    </div>
                    <span class="usa" contenteditable="true">List item text</span>
                </div>`,
                
                // With subtitle
                /*html*/
                `<div class="li-base li-padding-x" style="background-color: var(--input-bg-color);">
                    <div class="icon-container li-icon">
                        <i class="fas fa-bolt-lightning" style="color: var(--color-primary);"></i>
                    </div>
                    <div class="li-content">
                        <span class="usa" contenteditable="true">List item text</span>
                        <span contenteditable="true" class="li-subtitle usa">Subtitle text</span>
                    </div>
                </div>`,
        
                // With right chevron
                /*html*/
                `<div class="li-base li-padding-x li-space-between" style="background-color: var(--input-bg-color);">
                    <div class="icon-container li-icon" style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-check" style="color: var(--color-primary);"></i>
                        <span class="usa" contenteditable="true">List item text</span>
                    </div>
                    <div class="icon-container li-chevron">
                        <i class="fas fa-chevron-right" style="color: var(--color-primary);"></i>
                    </div>
                </div>`,
        
                // With right-aligned text
                /*html*/
                `<div class="li-base li-padding-x li-space-between" style="background-color: var(--input-bg-color);">
                    <div style="display: flex; align-items: center; gap: 12px; margin-left: 12px;">
                        <div class="icon-container">
                            <i class="fas fa-check" style="color: var(--color-primary);"></i>
                        </div>
                        <span class="usa" contenteditable="true">List item text</span>
                    </div>
                    <span class="usa" contenteditable="true" style="color: var(--color-primary); margin-right: 12px; font-size: 20px;">Big text</span>
                </div>`,
        
                // With avatar and subtitle
                /*html*/
                `<div class="li-base li-padding-x" style="background-color: var(--input-bg-color);">
                    <div class="nav-image li-avatar">
                        <i class="fa-solid fa-image image-ph non-editable"></i>
                    </div>
                    <div class="li-content">
                        <span class="usa" contenteditable="true">List item text</span>
                        <span contenteditable="true" class="li-subtitle usa">Subtitle text</span>
                    </div>
                </div>`,
        
                // Image left button right
                /*html*/
                `<div class="li-base li-padding-x li-space-between li-border-bottom" style="background-color: var(--input-bg-color);">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="nav-image li-avatar li-small-avatar">
                            <i class="fa-solid fa-image image-ph non-editable"></i>
                        </div>
                        <div>
                            <div class="usa" contenteditable="true" style="color: var(--color-primary);">Display Name</div>
                            <div class="usa" contenteditable="true" style="font-size: 12px; opacity: 0.7;">2m ago</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; margin-right: 6px;">
                        <div class="li-action" style="background-color: var(--color-primary);"><span>Action</span></div>  
                    </div>  
                </div>`,
        
                // Card-style list item
                /*html*/
                `<div class="li-base li-padding li-border-bottom" style="background-color: var(--color-primary);">
                    <div class="icon-container li-feature-icon-con">
                        <i class="fas fa-star" style="font-size: 16px;"></i>
                    </div>
                    <span class="usa" contenteditable="true" style="font-weight: 500;">Featured list item</span>
                </div>`,
        
                // Outlined style
                /*html*/
                `<div class="li-base li-padding-x" style="border: 2px solid; color: var(--color-primary);">
                    <div class="icon-container li-icon">
                        <i class="fas fa-arrow-right" style="color: var(--color-primary); font-size: 16px;"></i>
                    </div>
                    <span class="usa" contenteditable="true">Outlined list item</span>
                </div>`,
        
                // Pill style with gradient
                /*html*/
                `<div class="li-base li-pill" style="background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));">
                    <div class="icon-container">
                        <i class="fas fa-bolt" style="color: white; font-size: 16px;"></i>
                    </div>
                    <span class="usa" contenteditable="true" style="color: white;">Pill-shaped item</span>
                </div>`,
        
                // Slide reveal with delete button
                 /*html*/
                 `<div class="error-container li-slide-con">
                    <div class="li-slide-btn-con">
                        <div class="icon-container">
                            <button class="li-slide-btn" style="background-color: var(--color-secondary);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="li-base li-padding-x li-slide-content">
                        <span class="usa" contenteditable="true">Slide to reveal button</span>
                        <div class="icon-container li-icon">
                            <i class="fas fa-grip-lines-vertical slide-reveal-grip"></i>
                        </div>
                    </div>
                </div>`,

            // TIMELINE LIST ITEM
            /*html*/
            `<div class="card-timeline">
                <div class="card-timeline-dot" style="background-color: var(--color-primary);"></div>
                <div class="card-timeline-line"></div>
                <div class="usa tl-title">Timeline Item</div>
                <span class="card-text usa" style="font-size: 14px;">New features released to production</span>
                <br>
                <span class="usa card-time">2 hours ago</span>
            </div>`,
        ];      

        //LEFT CHAT (well, you have to tear it apart first)
            // Live Chat Feed
        //     `<div style="width: 100%; background-color: var(--input-bg-color); border-radius: var(--standard-radius); overflow: hidden; border: 1px solid var(--neutral-gray);">
        //     <div style="display: flex; flex-direction: column; height: 400px;">
        //         <!-- Header -->
        //         <div style="padding: 12px; border-bottom: 1px solid var(--neutral-gray); display: flex; justify-content: space-between; align-items: center;">
        //             <div style="display: flex; align-items: center; gap: 8px;">
        //                 <div class="icon-container">
        //                     <i class="fas fa-comments" style="color: var(--color-primary);"></i>
        //                 </div>
        //                 <span contenteditable="true" style="font-weight: 500; color: var(--basic-txt-color);">Live Chat</span>
        //             </div>
        //             <div style="display: flex; align-items: center; gap: 12px;">
        //                 <div style="display: flex; align-items: center; gap: 4px;">
        //                     <div class="icon-container">
        //                         <i class="fas fa-users"></i>
        //                     </div>
        //                     <span contenteditable="true">1.2K</span>
        //                 </div>
        //                 <div class="icon-container">
        //                     <i class="fas fa-gear"></i>
        //                 </div>
        //             </div>
        //         </div>

        //         <!-- Chat Messages -->
        //         <div style="flex: 1; overflow-y: auto; padding: 12px;">
        //             <!-- Message 1 -->
        //             <div style="margin-bottom: 16px;">
        //                 <div style="display: flex; gap: 8px; margin-bottom: 4px;">
        //                     <div class="nav-image" style="width: 32px; height: 32px; background-color: var(--neutral-gray); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;">
        //                         <span class="non-editable">IMG</span>
        //                     </div>
        //                     <div>
        //                         <div style="display: flex; align-items: center; gap: 8px;">
        //                             <span contenteditable="true" style="font-weight: 500; color: var(--basic-txt-color);">UserName</span>
        //                             <span contenteditable="true" style="font-size: 12px; color: var(--basic-txt-color); opacity: 0.7;">2m ago</span>
        //                         </div>
        //                         <div contenteditable="true">Great stream! Keep up the amazing work! 🎉</div>
        //                     </div>
        //                 </div>
        //             </div>

        //             <!-- Message 2 with Super Chat -->
        //             <div style="margin-bottom: 16px; background-color: rgba(52, 152, 219, 0.1); border-radius: 8px; padding: 12px;">
        //                 <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        //                     <div class="nav-image" style="width: 32px; height: 32px; background-color: var(--neutral-gray); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;">
        //                         <span class="non-editable">IMG</span>
        //                     </div>
        //                     <div style="flex: 1;">
        //                         <div style="display: flex; align-items: center; gap: 8px;">
        //                             <span contenteditable="true" style="font-weight: 500; color: var(--color-primary);">SuperFan123</span>
        //                             <div style="background-color: var(--color-primary); color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
        //                                 <span contenteditable="true">$5.00</span>
        //                             </div>
        //                             <span contenteditable="true" style="font-size: 12px; color: var(--basic-txt-color); opacity: 0.7;">1m ago</span>
        //                         </div>
        //                         <div contenteditable="true">Thanks for the tips! Here's a little support! 💖</div>
        //                     </div>
        //                 </div>
        //             </div>

        //             <!-- Message 3 with Membership -->
        //             <div style="margin-bottom: 16px;">
        //                 <div style="display: flex; gap: 8px;">
        //                     <div class="nav-image" style="width: 32px; height: 32px; background-color: var(--neutral-gray); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;">
        //                         <span class="non-editable">IMG</span>
        //                     </div>
        //                     <div>
        //                         <div style="display: flex; align-items: center; gap: 8px;">
        //                             <span contenteditable="true" style="font-weight: 500; color: var(--basic-txt-color);">NewMember</span>
        //                             <div style="background-color: var(--color-accent); color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
        //                                 <div class="icon-container">
        //                                     <i class="fas fa-star"></i>
        //                                 </div>
        //                             </div>
        //                             <span contenteditable="true" style="font-size: 12px; color: var(--basic-txt-color); opacity: 0.7;">Just now</span>
        //                         </div>
        //                         <div contenteditable="true" style="color: var(--color-accent);">🎉 Just became a member!</div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         <!-- Chat Input -->
        //         <div style="padding: 12px; border-top: 1px solid var(--neutral-gray); display: flex; gap: 8px;">
        //             <div style="flex: 1; display: flex; align-items: center; gap: 8px; background-color: var(--neutral-gray); border-radius: 20px; padding: 8px 16px;">
        //                 <div class="icon-container">
        //                     <i class="fas fa-face-smile"></i>
        //                 </div>
        //                 <div contenteditable="true" style="flex: 1; color: var(--basic-txt-color); opacity: 0.7;">Type a message...</div>
        //             </div>
        //             <button style="background-color: var(--color-primary); border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        //                 <div class="icon-container">
        //                     <i class="fas fa-paper-plane" style="color: white;"></i>
        //                 </div>
        //             </button>
        //         </div>
        //     </div>
        // </div>`,

// NAVBAR navbar:
    case 'navbar':
    return [
        // Default
        /*html*/
        `<div class="navContain">
            <div class="fw navbar top-navbar">
                <div>
                    <span spellcheck="false" class="nav-brand-text ml-16 usa" contenteditable="true">Brand</span>
                </div>
                
                <div class="icon-container nav-icon mr-16">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
            <div class="top-shadow-div"></div>
        </div>`,
        // IMG + Bars
        /*html*/
        `<div class="navContain">
            <div class="fw navbar top-navbar">
                <div class="ml-8" style="width: 21px"></div>
                <div class="nav-avatar nav-image">
                    <span class="non-editable"><i class="fas fa-image"></i></span>
                </div>
                <div class="icon-container nav-icon mr-16">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </div>`,
        // BRAND + background
        /*html*/
        `<div class="navContain">
            <div class="fw navbar nav-brand" style="background-color: var(--color-primary);">
                <div class="icon-container ml-16 nav-icon nav-icon-light mr-8">
                    <i class="fas fa-arrow-left"></i>
                </div>
                <div class="nav-center-content">
                    <span spellcheck="false" class="nav-title-text usa" contenteditable="true">Brand</span>
                </div>
                <div class="icon-container nav-icon nav-icon-light mr-16">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </div>`,
        // CHAT
        /*html*/
        `<div class="navContain">
            <div class="fw navbar top-navbar">
                <div class="icon-container nav-icon mr-16 ml-8">
                    <i class="fas fa-arrow-left"></i>
                </div>
                <div class="nav-avatar nav-image mr-16">
                    <span class="non-editable"><i class="fas fa-image"></i></span>
                </div>
                <div class="nav-flex-grow">
                    <span contenteditable="true" class="nav-username usa">Username</span>
                    <span contenteditable="true" class="nav-status usa">Online</span>
                </div>
                <div class="nav-icon-group">
                    <div class="icon-container nav-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="icon-container nav-icon mr-8">
                        <i class="fas fa-ellipsis-vertical"></i>
                    </div>
                </div>
            </div>
        </div>`,
        // Search Bar Navbar
        /*html*/
        `<div class="navContain">
        <div class="fw navbar top-navbar">
        <div class="icon-container ml-8 nav-icon mr-16">
            <i class="fas fa-arrow-left"></i>
        </div>
        <div class="nav-flex-grow mr-8" style="background-color: var(--input-bg-color); border-radius: 20px; padding: 6px 12px; display: flex; align-items: center;">
            <div class="icon-container nav-icon">
            <i class="fas fa-search"></i>
            </div>
            <span class="usa" contenteditable="true" style="margin-left: 10px; color: var(--basic-txt-color);">Search...</span>
        </div>
        <div class="icon-container mr-16 nav-icon">
            <i class="fas fa-microphone"></i>
        </div>
        </div>
        </div>`,
        // Category Tabs Navbar
        /*html*/
        `<div class="navContain">
        <div class="fw navbar top-navbar" style="overflow: auto;">
        <div style="width: 100%; display: flex; justify-content: flex-start; align-items: center;">
            <div class="icon-container mr-16 ml-16 nav-icon">
            <i class="fas fa-sliders"></i>
            </div>
            <div class="nav-pill" style="background-color: var(--color-primary);">
            <span class="usa" contenteditable="true">All</span>
            </div>
            <div class="nav-pill">
            <span class="usa" contenteditable="true">Popular</span>
            </div>
            <div class="nav-pill">
            <span class="usa" contenteditable="true">New</span>
            </div>
            <div class="nav-pill">
            <span class="usa" contenteditable="true">Trending</span>
            </div>
        </div>
        </div>
        </div>`,

        // Profile Options Navbar
        /*html*/
        `<div class="navContain">
            <div class="fw navbar top-navbar">
            <div class="nav-flex-grow">
                <span contenteditable="true" class="nav-brand-text ml-16 usa">Profile</span>
            </div>
            <div class="nav-icon-group mr-8">
                <div class="icon-container nav-icon">
                <i class="fas fa-bell"></i>
                </div>
                <div class="icon-container nav-icon">
                <i class="fas fa-gear"></i>
                </div>
                <div class="nav-avatar nav-image">
                    <span class="non-editable"><i class="fas fa-user"></i></span>
                </div>
            </div>
            </div>
        </div>`,
        // E-commerce Navbar
        /*html*/
        `<div class="navContain">
            <div class="fw navbar top-navbar">
                <div class="icon-container ml-8 nav-icon">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="nav-center-content">
                    <div>
                    <span class="nav-brand-text usa" contenteditable="true">SHOP</span>
                    </div>
                </div>
                <div class="nav-icon-group mr-8">
                    <div class="icon-container nav-icon">
                    <i class="fas fa-search"></i>
                    </div>
                    <div class="icon-container nav-icon">
                    <i class="fas fa-heart"></i>
                    </div>
                    <div class="icon-container nav-icon">
                    <i class="fas fa-shopping-cart"></i>
                    </div>
                </div>
            </div>
        </div>`,
        // Minimalist Navbar with Logo
        /*html*/
        `<div class="navContain">
            <div class="fw navbar top-navbar" style="justify-content: center; position: relative;">
                <div class="nav-avatar icon-container" style="background-color: var(--color-primary); position: absolute; left: 10px;">
                    <span class="non-editable"><i class="fas fa-bolt"></i></span>
                </div>
                <div class="nav-center-content">
                    <span class="nav-title-text usa" contenteditable="true">App Name</span>
                </div>
            </div>
        </div>`,
    ];

/// chatInput chatInput: chatInput-
       case 'chatInput':
        return [
            // Simple Original default chat input
            /*html*/
            `<div class="chat-input-con">
                <input type="text" placeholder="Type a message..." class="chat-input">
                <button class="chat-send-btn icon-container" style="background-color: var(--color-primary); color: white;">
                    <i class="fas fa-paper-plane chat-send-icon"></i>
                </button>
            </div>`,

            // Smile chat input
            /*html*/
            `<div class="chat-input-wrapper">
                <div class="chat-input-con">
                    <button class="chat-icon-btn icon-container">
                        <i class="far fa-smile"></i>
                    </button>
                    <input type="text" placeholder="Type a message..." class="chat-input">
                    <button class="chat-send-btn icon-container" style="background-color: var(--color-primary); color: white;">
                        <i class="fas fa-paper-plane chat-send-icon"></i>
                    </button>
                </div>
            </div>`,

            // ALL image and smile chat input
            /*html*/
            `<div class="chat-input-wrapper">
                <div class="chat-input-con">
                    <button class="chat-icon-btn icon-container" style="padding-left: 4px;">
                        <i class="far fa-smile"></i>
                    </button>
                    <button class="chat-icon-btn icon-container" style="padding-left: 0;">
                        <i class="far fa-image"></i>
                    </button>
                    <input type="text" placeholder="Type a message..." class="chat-input" style="padding: 8px 4px;">
                    <button class="chat-send-btn icon-container" style="background-color: var(--color-primary); color: white;">
                        <i class="fas fa-paper-plane chat-send-icon"></i>
                    </button>
                </div>
            </div>`,

            // Live stream
            /*html*/
            `<div class="chat-input-wrapper">
              <div class="chat-stream-container">
                <div class="chat-stream-input">
                    <div class="icon-container">
                        <i class="fas fa-face-smile"></i>
                    </div>
                    <div contenteditable="true" class="chat-stream-placeholder usa">Type a message...</div>
                </div>
                <button class="chat-send-btn" style="background-color: var(--color-primary);">
                    <div class="icon-container">
                        <i class="fas fa-message"></i>
                    </div>
                </button>
              </div>
            </div>`,

            // Comments input
            /*html*/
            `<div class="chat-input-wrapper">
              <div class="chat-input-con">
                <div class="nav-image" style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: var(--input-bg-color);">
                    <span class="non-editable fas fa-image"></span>
                </div>
                <input type="text" placeholder="Write a comment..." class="chat-input">
                <button class="chat-icon-btn icon-container" style="padding: 8px;">
                    <i class="far fa-paper-plane"></i>
                </button>
              </div>
            </div>`,

            // AI prompt box: tall rounded field, toolbar with attach / model pill / mic / send.
            // Only the send is a <button> — prototype.js treats any button after the field as send.
            /*html*/
            `<div class="chat-input-wrapper chat-prompt">
              <div class="chat-prompt-box">
                <input type="text" placeholder="Ask anything..." class="chat-input">
                <div class="chat-prompt-bar">
                    <div class="icon-container chat-prompt-btn"><i class="fas fa-plus"></i></div>
                    <div class="chat-prompt-model"><span class="usa" contenteditable="true">Smart</span><i class="fas fa-chevron-down non-editable"></i></div>
                    <div class="chat-prompt-spacer"></div>
                    <div class="icon-container chat-prompt-btn"><i class="fas fa-microphone"></i></div>
                    <button class="chat-send-btn icon-container chat-prompt-send" style="background-color: var(--color-primary); color: white;">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                </div>
              </div>
            </div>`
        ];

        // HERO SEND ME A HERO //
        case 'hero':
        return [
            // Refreshed classic heroes (variants 1-7). Template indices depend on this order.
            // Heroes saved before the refresh keep their old markup and classes (hero-base,
            // hero-split, blob-con…), whose CSS is kept for them.

            // 1 · Gradient: image fading into the primary color, centered text (default insert)
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-fade">
                <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                <div class="hx-tint pe-none" style="background-color: var(--color-primary);"></div>
                <div class="hx-body">
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Welcome</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">Everything you need, beautifully in one place.</p>
                    </div>
                </div>
            </div>`,

            // 2 · Dark gradient: article-style, left aligned with meta and a read link
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-article">
                <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                <div class="hx-scrim"></div>
                <div class="hx-body">
                    <div class="hx-meta-row">
                        <span contenteditable="true" class="hx-tag usa" style="background-color: var(--color-primary);">Travel</span>
                        <span contenteditable="true" class="hx-meta usa">5 min read</span>
                    </div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Slow mornings in Lisbon</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">Tiled streets, warm pastries and the best views in town.</p>
                    </div>
                    <div class="hx-link hx-link-light"><span contenteditable="true" class="usa">Read story</span><span class="icon-container"><i class="fas fa-arrow-right"></i></span></div>
                </div>
            </div>`,

            // 3 · With button: centered headline + call to action over a tinted image
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-cta">
                <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                <div class="hx-tint hx-tint-diag pe-none" style="background-color: var(--color-primary);"></div>
                <div class="hx-body">
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Work smarter, not harder</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">One simple app to plan, track and finish what matters.</p>
                    </div>
                    <!-- .align-content: left/right arrows like the avatar's (createAlignmentControls) -->
                    <div class="hx-actions align-content" data-alignment="center" style="justify-content: center;">
                        <div contenteditable="true" class="hx-btn hx-btn-light usa">Get started</div>
                    </div>
                </div>
            </div>`,

            // 4 · Split screen: color panel beside an image
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-split2">
                <div class="hx-panel" style="background-color: var(--color-primary);">
                    <div><span contenteditable="true" class="hx-kicker usa">01 · New</span></div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Made for the way you live</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">Simple tools for busy days.</p>
                    </div>
                    <div class="hx-link hx-link-inherit"><span contenteditable="true" class="usa">Explore</span><span class="icon-container"><i class="fas fa-arrow-right"></i></span></div>
                </div>
                <div class="hx-split-media">
                    <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i></span></div>
                </div>
            </div>`,

            // 5 · Diagonal: angled color panel cutting across an image
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-diag">
                <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                <div class="hx-diag-panel" style="background-color: var(--color-primary);">
                    <div class="hx-body">
                        <div class="heading-wrapper">
                            <h1 contenteditable="true" class="hx-title usa">Bold ideas, sharp angles</h1>
                        </div>
                        <div>
                            <p contenteditable="true" class="hx-text usa">Add a little edge to your story.</p>
                        </div>
                        <div class="hx-actions align-content" data-alignment="flex-start" style="justify-content: flex-start;">
                            <div contenteditable="true" class="hx-btn usa" style="background-color: var(--color-accent);">Discover</div>
                        </div>
                    </div>
                </div>
            </div>`,

            // 6 · Floating card: image with a raised card overlapping its bottom edge
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-float">
                <div class="hx-float-media">
                    <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                </div>
                <div class="hx-float-card">
                    <div class="hx-eyebrow-row align-content" data-alignment="flex-start" style="justify-content: flex-start;"><span contenteditable="true" class="hx-eyebrow hx-soft usa">Limited time</span></div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Floating Card Hero</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">A modern hero with a raised card that sits over the image.</p>
                    </div>
                    <div class="hx-actions align-content" data-alignment="flex-start" style="justify-content: flex-start;">
                        <div contenteditable="true" class="hx-btn usa" style="background-color: var(--color-primary);">Shop now</div>
                        <div class="hx-link"><span contenteditable="true" class="usa">Details</span><span class="icon-container"><i class="fas fa-arrow-right"></i></span></div>
                    </div>
                </div>
            </div>`,

            // 7 · Image shapes: headline on top, a row of shaped images (arch, circle, leaf) below.
            // Shapes keep their aspect ratio, so resizing the hero only adds space; they never squish.
            /*html*/
            `<div class="resizeable hero hx hx-blobs">
                <div class="hx-body">
                    <div class="hx-eyebrow-row align-content" data-alignment="flex-start" style="justify-content: flex-start;"><span contenteditable="true" class="hx-eyebrow hx-soft usa">Community</span></div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Meet your people</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">Join groups, share moments and find friends who get you.</p>
                    </div>
                    <div class="hx-actions align-content" data-alignment="flex-start" style="justify-content: flex-start;">
                        <div contenteditable="true" class="hx-btn usa" style="background-color: var(--color-primary);">Join the community</div>
                    </div>
                </div>
                <div class="hx-shapes">
                    <div class="hx-shape hx-shape-arch hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i></span></div>
                    <div class="hx-shape hx-shape-circle hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i></span></div>
                    <div class="hx-shape hx-shape-leaf hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i></span></div>
                </div>
            </div>`,

            // ---- Modern heroes (hx-*, css/componentVariants.css "MODERN HEROES") ----
            // Image slots (.hx-media.card-image) show a theme-colored mesh gradient until an
            // image is added; the upload replaces the gradient (inline background-image).

            // Immersive: full-bleed image, eyebrow, headline, two CTAs
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-immersive">
                <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                <div class="hx-scrim"></div>
                <div class="hx-body">
                    <div class="hx-eyebrow-row align-content" data-alignment="flex-start" style="justify-content: flex-start;"><span contenteditable="true" class="hx-eyebrow hx-glass usa">New season</span></div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Find your next adventure</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">Curated trips and hidden gems, picked just for you.</p>
                    </div>
                    <div class="hx-actions align-content" data-alignment="flex-start" style="justify-content: flex-start;">
                        <div contenteditable="true" class="hx-btn usa" style="background-color: var(--color-primary);">Get started</div>
                        <div contenteditable="true" class="hx-btn hx-glass usa">Learn more</div>
                    </div>
                </div>
            </div>`,

            // Spotlight card: inset rounded image card with a round arrow button
            /*html*/
            `<div class="resizeable hero hx hx-spotlight">
                <div class="hx-card">
                    <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                    <div class="hx-scrim"></div>
                    <div class="hx-body">
                        <div class="hx-eyebrow-row align-content" data-alignment="flex-start" style="justify-content: flex-start;"><span contenteditable="true" class="hx-eyebrow hx-glass usa">Featured</span></div>
                        <div class="heading-wrapper">
                            <h1 contenteditable="true" class="hx-title usa">The Summer Edit</h1>
                        </div>
                        <div>
                            <p contenteditable="true" class="hx-text usa">Light layers for long, warm days.</p>
                        </div>
                    </div>
                    <div class="hx-round-btn icon-container" style="background-color: var(--color-accent);"><i class="fas fa-arrow-right"></i></div>
                </div>
            </div>`,

            // Editorial: type-led headline with a highlighted phrase + social proof
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-editorial">
                <div class="hx-glow pe-none"></div>
                <div class="hx-body">
                    <div class="hx-eyebrow-row align-content" data-alignment="flex-start" style="justify-content: flex-start;"><span class="hx-eyebrow hx-soft"><span class="hx-dot non-editable"></span><span contenteditable="true" class="usa">Now in beta</span></span></div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Design beautiful apps <span class="hx-mark">in minutes</span></h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">Drag, drop and ship polished screens without writing a line of code.</p>
                    </div>
                    <div class="hx-actions align-content" data-alignment="flex-start" style="justify-content: flex-start;">
                        <div contenteditable="true" class="hx-btn usa" style="background-color: var(--color-primary);">Start for free</div>
                        <div class="hx-link"><span contenteditable="true" class="usa">See how it works</span><span class="icon-container"><i class="fas fa-arrow-right"></i></span></div>
                    </div>
                    <div class="hx-proof">
                        <div class="hx-avatars">
                            <div class="hx-avatar card-image"></div>
                            <div class="hx-avatar card-image"></div>
                            <div class="hx-avatar card-image"></div>
                        </div>
                        <div class="hx-proof-text">
                            <div class="hx-stars icon-container non-editable"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                            <p contenteditable="true" class="usa">Loved by 12,000+ makers</p>
                        </div>
                    </div>
                </div>
            </div>`,

            // Frosted glass: full-bleed image with a blurred glass panel
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-frosted">
                <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                <div class="hx-glass-panel">
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Sleep better tonight</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">Guided wind-downs and soundscapes that help you drift off faster.</p>
                    </div>
                    <div class="hx-actions align-content" data-alignment="flex-start" style="justify-content: flex-start;">
                        <div contenteditable="true" class="hx-btn usa" style="background-color: var(--color-primary);">Try it free</div>
                        <div contenteditable="true" class="hx-meta usa">7-day trial · Cancel anytime</div>
                    </div>
                </div>
            </div>`,

            // Bento: headline over a grid of image tiles and a stat tile
            /*html*/
            `<div class="resizeable hero hx hx-bento">
                <div class="hx-body">
                    <div class="hx-eyebrow-row align-content" data-alignment="flex-start" style="justify-content: flex-start;"><span contenteditable="true" class="hx-eyebrow hx-soft usa">Stays</span></div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Spaces that feel like home</h1>
                    </div>
                </div>
                <div class="hx-grid">
                    <div class="hx-tile hx-tile-tall hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i></span></div>
                    <div class="hx-tile hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i></span></div>
                    <div class="hx-tile hx-stat" style="background-color: var(--color-accent);">
                        <div class="hx-stat-num"><span contenteditable="true" class="usa">4.9</span><span class="icon-container"><i class="fas fa-star"></i></span></div>
                        <div><span contenteditable="true" class="hx-stat-label usa">from 8k+ guests</span></div>
                    </div>
                </div>
            </div>`,

            // Bold color: theme-colored band with a CTA and a row of stats
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-bold" style="background-color: var(--color-primary);">
                <div class="hx-rings pe-none"></div>
                <div class="hx-body">
                    <div class="hx-eyebrow-row align-content" data-alignment="flex-start" style="justify-content: flex-start;"><span contenteditable="true" class="hx-eyebrow hx-glass usa">Creator tools</span></div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Grow your audience faster</h1>
                    </div>
                    <div>
                        <p contenteditable="true" class="hx-text usa">Everything you need to publish, promote and get paid.</p>
                    </div>
                    <div class="hx-actions align-content" data-alignment="flex-start" style="justify-content: flex-start;">
                        <div contenteditable="true" class="hx-btn usa" style="background-color: var(--color-accent);">Join for free</div>
                    </div>
                    <div class="hx-stats">
                        <div class="hx-stat-item"><span contenteditable="true" class="hx-stat-num usa">50k+</span><span contenteditable="true" class="hx-stat-label usa">Creators</span></div>
                        <div class="hx-stat-item"><span contenteditable="true" class="hx-stat-num usa">4.9</span><span contenteditable="true" class="hx-stat-label usa">App rating</span></div>
                        <div class="hx-stat-item"><span contenteditable="true" class="hx-stat-num usa">120</span><span contenteditable="true" class="hx-stat-label usa">Countries</span></div>
                    </div>
                </div>
            </div>`,

            // Search: greeting + headline over an image, with a search field and category chips
            /*html*/
            `<div class="resizeable hero hx hx-bleed hx-search-hero">
                <div class="hx-media card-image"><span class="hx-hint non-editable"><i class="fa-solid fa-image"></i> Add image</span></div>
                <div class="hx-scrim hx-scrim-full"></div>
                <div class="hx-body">
                    <div><p contenteditable="true" class="hx-greeting usa">Hi, Alex 👋</p></div>
                    <div class="heading-wrapper">
                        <h1 contenteditable="true" class="hx-title usa">Where to next?</h1>
                    </div>
                    <div class="hx-search">
                        <span class="icon-container"><i class="fas fa-magnifying-glass"></i></span>
                        <input type="text" placeholder="Search destinations">
                    </div>
                    <div class="hx-chips">
                        <span contenteditable="true" class="hx-chip hx-glass usa">Beaches</span>
                        <span contenteditable="true" class="hx-chip hx-glass usa">Mountains</span>
                        <span contenteditable="true" class="hx-chip hx-glass usa">Cities</span>
                    </div>
                </div>
            </div>`
        ];

/// image image: image-
    case 'image':
        return [ 
            // SINGLE ORIGINAL
            /*html*/
            `<div class="fw">
                <div class="card-image ui-image resizeable">
                    <i class="fa-solid fa-image image-ph"></i>    
                    <span class="non-editable">Click to add image</span>
                </div>
            </div>`,
            // SINGLE FULL WIDTH
            /*html*/
            `<div class="fw up-card">
                <div class="card-image ui-image-full resizeable">
                    <i class="fa-solid fa-image image-ph"></i>
                    <span class="non-editable">Click to add full-width image</span>
                </div>
            </div>`,
            // DOUBLE IMAGE
            /*html*/
            `<div class="ui-image-double resizeable">
                <div class="card-image ui-image-double-item">
                    <i class="fa-solid fa-image image-ph"></i>
                    <span class="non-editable">Click to add image</span>
                </div>
                <div class="card-image ui-image-double-item">
                    <i class="fa-solid fa-image image-ph"></i>
                    <span class="non-editable">Click to add image</span>
                </div>
            </div>`,
            // TRIPLE IMAGE
            /*html*/
            `<div class="ui-image-triple resizeable">
                <div class="card-image ui-image-triple-item">
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
                <div class="card-image ui-image-triple-item">
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
                <div class="card-image ui-image-triple-item">
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
            </div>`,
            // TEXT ON IMAGE OVERLAY
            /*html*/
            `<div class="ui-image-overlay fw">
                <div class="card-image ui-image-overlay-base resizeable">
                    <i class="fa-solid fa-image non-editable ui-image-placeholder-icon pe-none"></i>
                </div>
                <div class="ui-image-overlay-text">
                    <div class="heading-wrapper">
                        <h2 class="ui-image-title">Image Title</h2>
                    </div>
                    <div>
                        <p class="ui-image-text">Click to edit text</p>
                    </div>
                </div>
            </div>`,

            // POLAROID STYLE
            // /*html*/
            // `<div class="fw">
            //     <div class="polaroid">
            //         <div class="card-image polaroid-inner">
            //             <i class="fa-solid fa-image image-ph non-editable"></i>
            //         </div>
            //         <div class="polaroid-caption" contenteditable="true">Add a caption</div>
            //     </div>
            // </div>`,

            // CIRCLE CROP
            /*html*/
            `<div class="ui-image-circle-con resizeable hero" data-aspect-ratio="1">
                <div class="ui-image-circle-wrapper align-content">
                    <div class="card-image ui-image-circle">
                        <i class="fa-solid fa-image image-ph non-editable"></i>
                    </div>
                </div>
            </div>`,

            // IMAGE COMPARISON SLIDER
            // /*html*/
            // `<div class="fw">
            //     <div class="ui-image-compare">
            //         <div class="card-image resizeable" style="height: 100%">
            //             <i class="fa-solid fa-image image-ph non-editable"></i>
            //         </div>
            //         <div class="ui-image-compare-overlay">
            //             <div class="card-image resizeable" style="height: 100%">
            //                 <i class="fa-solid fa-image image-ph non-editable"></i>
            //             </div>
            //         </div>
            //         <div class="ui-image-compare-handle">
            //             <i class="fas fa-arrows-left-right"></i>
            //         </div>
            //     </div>
            // </div>`,

        ];

        //image Gallery: 
        case 'imgGallery':
        return [
            /*html*/
            `<div class="image-gallery-wrapper" style="width: 100%; position: relative;">
                <div class="image-gallery-con">
                    <div class="ig-left-column-con">
                        <div class="ig-image-wrapper">
                            <div class="card-image resizeable ig-img-box">
                                <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                                <span style="color: var(--basic-txt-color)" class="imgMsg non-editable">Click to add image</span>
                            </div>
                        </div>
                        <div class="ig-image-wrapper">
                            <div class="card-image resizeable ig-img-box">
                                <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                                <span style="color: var(--basic-txt-color)" class="imgMsg non-editable">Click to add image</span>
                            </div>
                        </div>
                    </div>
                    <div class="ig-right-column-con">
                        <div class="ig-image-wrapper">
                            <div class="card-image resizeable ig-img-box">
                                <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                                <span style="color: var(--basic-txt-color)" class="imgMsg non-editable">Click to add image</span>
                            </div>
                        </div>
                        <div class="ig-image-wrapper">
                            <div class="card-image resizeable ig-img-box">
                                <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                                <span style="color: var(--basic-txt-color)" class="imgMsg non-editable">Click to add image</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="fa fa-plus ig-add-btn" style="display: none;"></button>
            </div>`,
            // Slider Gallery
            /*html*/
            `<div class="img-gallery-slider resizeable">
                <div class="img-gallery-slider-row">
                    <div class="card-image img-gallery-side-image">
                        <i class="fa fa-image img-gallery-ph"></i>
                    </div>

                    <div class="img-gallery-center-overlay"></div>
                    <div class="card-image img-gallery-center-image">
                        <i class="fa fa-image img-gallery-ph"></i>
                    </div>

                    <div class="card-image img-gallery-side-image">
                        <i class="fa fa-image img-gallery-ph"></i>
                    </div>
                </div>
                <i class="fas fa-caret-left img-gallery-nav img-gallery-nav-left"></i>
                <i class="fas fa-caret-right img-gallery-nav img-gallery-nav-right"></i>

                <div class="img-gallery-dots">
                    <div class="img-gallery-dot"></div>
                    <div class="img-gallery-dot active"></div>
                    <div class="img-gallery-dot"></div>
                </div>
            </div>`,
            
            // Grid Gallery
            /*html*/
            `<div class="img-gallery-grid resizeable">
                <div class="card-image img-gallery-grid-item">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-grid-item">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-grid-item">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-grid-item">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-grid-item">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-grid-item">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
            </div>`,

            // Preview Strip
            /*html*/
            `<div class="img-gallery-strip resizeable">
                <div class="card-image img-gallery-strip-thumb">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-strip-thumb">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-strip-thumb">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-strip-thumb">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
                <div class="card-image img-gallery-strip-thumb">
                    <i class="fa fa-image img-gallery-ph"></i>
                </div>
            </div>`,

            // Pager: one full-width image at a time, swipe between them, dots below.
            // The dots (and the thumbnails / counter of the next variant) are rebuilt from
            // the slides by setupPagerGallery, so the markup here is only a starting point.
            /*html*/
            `<div class="img-gallery-pager resizeable">
                <div class="img-gallery-pager-main">
                    <div class="img-gallery-pager-track">
                        <div class="card-image img-gallery-pager-slide"><i class="fa fa-image img-gallery-ph"></i></div>
                        <div class="card-image img-gallery-pager-slide"><i class="fa fa-image img-gallery-ph"></i></div>
                        <div class="card-image img-gallery-pager-slide"><i class="fa fa-image img-gallery-ph"></i></div>
                        <div class="card-image img-gallery-pager-slide"><i class="fa fa-image img-gallery-ph"></i></div>
                    </div>
                    <div class="img-gallery-pager-dots non-editable"><span class="active"></span><span></span><span></span><span></span></div>
                </div>
            </div>`,

            // Pager + thumbnails (product-detail gallery): tap a thumbnail to show that image
            /*html*/
            `<div class="img-gallery-pager img-gallery-pager-with-thumbs resizeable">
                <div class="img-gallery-pager-main">
                    <div class="img-gallery-pager-track">
                        <div class="card-image img-gallery-pager-slide"><i class="fa fa-image img-gallery-ph"></i></div>
                        <div class="card-image img-gallery-pager-slide"><i class="fa fa-image img-gallery-ph"></i></div>
                        <div class="card-image img-gallery-pager-slide"><i class="fa fa-image img-gallery-ph"></i></div>
                        <div class="card-image img-gallery-pager-slide"><i class="fa fa-image img-gallery-ph"></i></div>
                    </div>
                    <div class="img-gallery-pager-count non-editable">1 / 4</div>
                </div>
                <div class="img-gallery-pager-thumbs non-editable">
                    <div class="img-gallery-pager-thumb active"><i class="fa fa-image img-gallery-ph"></i></div>
                    <div class="img-gallery-pager-thumb"><i class="fa fa-image img-gallery-ph"></i></div>
                    <div class="img-gallery-pager-thumb"><i class="fa fa-image img-gallery-ph"></i></div>
                    <div class="img-gallery-pager-thumb"><i class="fa fa-image img-gallery-ph"></i></div>
                </div>
            </div>`
        ];

        // INPUT-
        case 'input':
        return [
            // Simple Original default input
            /*html*/
            `<div class="ui-input-wrapper">
                <div contenteditable="true" class="ui-input-base empty" data-placeholder="Text Input Field" spellcheck="false" style="border-bottom: 2px solid var(--color-primary);">
                </div>
            </div>`,
            // Input with label
            /*html*/
            `<div class="ui-input-wrapper">
                <div class="ui-input-label">Label</div>
                <div contenteditable="true" spellcheck="false" class="ui-input-base empty" data-placeholder="Placeholder" style="border-bottom: 2px solid var(--color-primary);">
                </div>
            </div>`,
            // Required input with asterisk
            /*html*/
            `<div class="ui-input-wrapper">
                <div class="ui-input-required-label">
                <div class="ui-input-required-asterisk">*</div>
                    <div class="ui-input-label">Required</div>
                    
                </div>
                <div contenteditable="true" spellcheck="false" class="ui-input-base empty" data-placeholder="Placeholder" style="border-bottom: 2px solid var(--color-primary);">
                </div>
            </div>`,
            // Focused Input Selected
            /*html*/
            `<div class="fw">
                <div class="ui-input-label">Label</div>
                <div class="ui-input-focused-wrapper" style="border-color: var(--color-primary);">
                    <div class="ui-input-wrapper">
                        <div contenteditable="true" spellcheck="false" class="ui-input-base empty" data-placeholder="Selected Field" style="border: 3px solid var(--neutral-gray);">
                        </div>
                    </div>
                </div>
            </div>`,
            // Outlined input
            /*html*/
            `<div class="ui-input-wrapper">
                <div class="ui-input-label">Label</div>
                <div contenteditable="true" spellcheck="false" class="ui-input-base ui-input-outlined empty" data-placeholder="Outlined Input" style="border: 2px solid var(--color-primary);">
                </div>
            </div>`,
            // Password input
            /*html*/
            `<div class="ui-input-wrapper">
                <div class="ui-input-label">Label</div>
                <div class="ui-input-password-wrapper">
                    <div contenteditable="true" spellcheck="false" class="ui-input-base empty password-input" data-placeholder="Password" style="border-bottom: 2px solid var(--color-primary);">
                    </div>
                    <div class="icon-container ui-input-password-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="ui-input-password-hint">
                        Must be at least 8 characters long
                    </div>
                </div>
            </div>`,
            // Error input
            /*html*/
            `<div class="ui-input-wrapper">
                <div class="ui-input-label">Label</div>
                <div contenteditable="true" spellcheck="false" class="ui-input-base ui-input-error empty" data-placeholder="Input Field">
                </div>
                <div class="ui-input-error-message">
                    <i class="fas fa-exclamation-triangle ui-input-error-icon"></i>
                    <div class="usa" contenteditable="true">Please enter a valid value</div>
                </div>
            </div>`,
            // Disabled input
            /*html*/
            `<div class="ui-input-wrapper">
                <div class="ui-input-label">Label</div>
                <div contenteditable="true" spellcheck="false" class="ui-input-base ui-input-disabled empty" data-placeholder="Disabled" style="border-color: var(--color-secondary);">
                </div>
            </div>`,
            // Input with success state
            /*html*/
            `<div class="ui-input-wrapper">
                <div class="ui-input-label">Label</div>
                <div class="ui-input-password-wrapper">
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ui-input-success empty" data-placeholder="Success">
                    </div>
                    <div class="icon-container ui-input-success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="ui-input-success-message">Success message</div>
            </div>`,
            // Input with prefix
            /*html*/
            `<div class="ui-input-wrapper">
                <div class="ui-input-label">Label</div>
                <div class="ui-input-prefix-wrapper" style="border-bottom: 2px solid var(--color-accent);">
                    <div class="icon-container ui-input-prefix">
                        <i class="fa-solid fa-dollar-sign"></i>
                    </div>
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ui-input-with-prefix empty" data-placeholder="0.00">
                    </div>
                </div>
            </div>`
        ];

        // Add progress bar variants progressbar: progress indicator
        case 'progressBar':
        return [
            // Default - Original
            /*html*/
            `<div class="progress-group" class="fw">
                <div class="progress-bar" style="width: 100%; height: 6px; background-color: var(--neutral-gray); border-radius: 5px; overflow: hidden;">
                    <div style="width: 76%; height: 100%; background-color: var(--color-primary); transition: width 0.3s ease;"></div>
                </div>
                <div class="usa" contenteditable="true" style="margin-top: 5px; font-weight: bold; color: var(--basic-txt-color);">76%</div>
            </div>`,

            // Thick Bar
            /*html*/
            `<div class="progress-group fw">
                <div class="progress-bar progress-bar-medium" style="background-color: var(--neutral-gray);">
                    <div class="progress-bar-inner" style="width: 76%; background-color: var(--color-primary);"></div>
                </div>
                <div class="progress-label">76%</div>
            </div>`,

            // Pill Style with Label Inside
            /*html*/
            `<div class="progress-group fw">
                <div class="progress-bar progress-bar-labeled" style="background-color: var(--neutral-gray); border-radius: 15px;">
                    <div class="progress-bar-inner" style="width: 76%; background-color: var(--color-secondary);">
                        <span>76%</span>
                    </div>
                </div>
            </div>`,

            // Gradient Bar
            /*html*/
            `<div class="progress-group fw">
                <div class="progress-bar progress-bar-medium" style="background-color: var(--neutral-gray);">
                    <div class="progress-bar-inner" style="width: 76%; background: linear-gradient(45deg, var(--color-primary), var(--color-accent));"></div>
                </div>
                <div class="progress-value" style="margin: 5px 0 0 12px;">76%</div>
            </div>`,

            // Circular Progress Normal
            /*html*/
            `<div class="progress-group" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
            <div class="progress-bar resizeable" style="width: 100%; max-width: 350px; height: 66px; aspect-ratio: 1; position: relative;">
                <svg viewBox="0 0 36 36" style="width: 100%; height: 100%;">
                    <path d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--neutral-gray)"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--color-primary)"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-dasharray="76, 100"
                        style="transition: stroke-dasharray 0.3s ease;"
                    />
                </svg>
                <div class="usa" contenteditable="true" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; font-size: calc(0.15 * var(--progress-size, 100px)); color: var(--basic-txt-color);">76%</div>
            </div>
        </div>`,

        // Thick Gradient Circle
        /*html*/
        `<div class="progress-group" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
            <div class="progress-bar resizeable" style="width: 100%; height: 120px; position: relative;">
                <svg viewBox="0 0 36 36" style="width: 100%; height: 100%;">
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color: var(--color-primary)"/>
                            <stop offset="100%" style="stop-color: var(--color-accent)"/>
                        </linearGradient>
                    </defs>
                    <path d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--neutral-gray)"
                        stroke-width="4"
                        stroke-linecap="round"
                    />
                    <path d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#progressGradient)"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-dasharray="76, 100"
                        style="transition: stroke-dasharray 0.3s ease;"
                    />
                </svg>
                <div class="usa" contenteditable="true" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; font-size: 24px; font-weight: bold; color: var(--basic-txt-color);">76%</div>
            </div>
        </div>`,

        // Pie Chart
        /*html*/
        `<div class="progress-group" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
            <div class="progress-bar resizeable" style="width: 100%; height: 80px; position: relative; overflow: hidden; box-sizing: border-box;">
                <svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg); width: 100%; height: 100%; display: block;">
                    <!-- Background Circle -->
                    <circle cx="0" cy="0" r="1"
                        fill="var(--neutral-gray)"
                    />
                    <!-- Progress Pie Slice -->
                    <path d="M 0 0 L 1 0 A 1 1 0 0 1 0.866 0.5 L 0 0"
                        fill="var(--color-primary)"
                        stroke="none"
                        transform="scale(0.99)"
                        style="transform-origin: center; transition: transform 0.3s ease-in-out, d 0.3s ease-in-out;"
                    />
                </svg>
                <div class="usa" contenteditable="true" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; color: var(--basic-txt-color); pointer-events: all;">76%</div>
            </div>
        </div>`
        ];

            // Embedded Video Player (this could be put back in)
            // `<div class="fw">
            //     <div class="video-embed-container" style="width: 100%; background-color: var(--neutral-gray); border-radius: var(--standard-radius); overflow: hidden; position: relative;">
            //         <div class="video-placeholder" style="width: 100%; aspect-ratio: 16/9; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px; position: relative;">
            //             <div style="margin-bottom: 8px;">
            //                 <i class="fas fa-video" style="font-size: 24px; color: var(--basic-txt-color); cursor: default;"></i>
            //             </div>
            //             <input type="text" placeholder="Enter video URL (YouTube, Vimeo)" style="width: 80%; padding: 8px 12px; border: 1px solid var(--neutral-gray); border-radius: 4px; background: var(--input-bg-color); color: var(--basic-txt-color); pointer-events: all;">
            //             <div class="embed-video-btn" style="padding: 6px 12px; background: var(--interface-color); color: white; border-radius: 4px; cursor: pointer; pointer-events: all;">
            //                 Embed Video
            //             </div>
            //         </div>
            //         <div class="embedded-video" style="display: none; width: 100%; aspect-ratio: 16/9; position: relative;">
            //             <!-- Iframe will be inserted here -->
            //         </div>
            //     </div>
            // </div>`,

    // Footer 
    case 'footer':
        return [
            // Standard Footer
            /*html*/
            `<div class="footer-wrapper" style="background-color: var(--color-primary);">
                <div class="footer-container footer-standard">
                    <div class="footer-brand-section">
                        <div class="card-image footer-logo">
                            <i class="fa-solid fa-image non-editable" style="color: var(--placeholder-color);"></i>
                        </div>
                        <div>
                            <h3 contenteditable="true" spellcheck="false" class="footer-heading usa">Brand</h3>
                        </div>
                    </div>
                    <div class="footer-links-section">
                        <ul class="footer-link-column">
                            <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">About Us</a></li>
                            <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Contact</a></li>
                            <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Careers</a></li>
                        </ul>
                        <ul class="footer-link-column">
                            <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Support</a></li>
                            <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Privacy Policy</a></li>
                            <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Terms of Use</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom-section">
                    <div class="footer-social-icons">
                        <div class="icon-container">
                            <i class="fas fa-seedling"></i>
                        </div>
                        <div class="icon-container">
                            <i class="fas fa-bolt-lightning"></i>
                        </div>
                        <div class="icon-container">
                            <i class="fas fa-skull"></i>
                        </div>
                    </div>
                </div>
            </div>`,
            
            // 2 · Wordmark sign-off: centered logo, tagline, pill links, social row, and the brand
            // name set huge at the bottom, running off the screen's edge (fw-* in
            // css/componentVariants.css). It fills the bottom clearance the color swatches need.
            // Keeps .footer-heading / .footer-copyright-text — templates.js fills them.
            /*html*/
            `<div class="component-footer">
                <div class="footer-wrapper fw-sign" style="background-color: var(--color-primary);">
                    <div class="fw-glow pe-none"></div>
                    <div class="footer-container footer-centered fw-sign-inner">
                        <div class="card-image footer-logo fw-logo">
                            <i class="fa-solid fa-bolt non-editable"></i>
                        </div>
                        <div>
                            <p contenteditable="true" class="footer-text fw-tagline usa">Made for the way you work.</p>
                        </div>
                        <div class="fw-pills">
                            <a href="#" contenteditable="true" class="footer-link fw-pill usa">About</a>
                            <a href="#" contenteditable="true" class="footer-link fw-pill usa">Contact</a>
                            <a href="#" contenteditable="true" class="footer-link fw-pill usa">Terms</a>
                            <a href="#" contenteditable="true" class="footer-link fw-pill usa">Privacy</a>
                        </div>
                        <div class="fw-social">
                            <div class="icon-container"><i class="fab fa-instagram"></i></div>
                            <div class="icon-container"><i class="fab fa-x-twitter"></i></div>
                            <div class="icon-container"><i class="fab fa-facebook"></i></div>
                            <div class="icon-container"><i class="fab fa-linkedin-in"></i></div>
                        </div>
                        <div>
                            <p contenteditable="true" class="footer-copyright-text usa">© 2025 Brand. All rights reserved.</p>
                        </div>
                        <div class="fw-mark">
                            <h3 contenteditable="true" spellcheck="false" class="footer-heading fw-mark-text usa">Brand</h3>
                        </div>
                    </div>
                </div>
            </div>`,
            
            // App Footer with Newsletter
            /*html*/
            `<div class="component-footer">
            <div class="footer-wrapper" style="background-color: var(--color-primary);">
                <div class="footer-container footer-app">
                    <div class="footer-flex-row">
                        <div class="footer-newsletter">
                            <div>
                            <h3 contenteditable="true" class="footer-heading usa">Stay Updated</h3>
                            </div>
                            <div>
                            <p contenteditable="true" class="footer-text usa">Subscribe to our newsletter for the latest updates and offers.</p>
                            </div>
                            <div class="footer-newsletter-form">
                                <input type="email" placeholder="Your email" class="footer-input">
                                <button style="background-color: var(--color-accent);" class="footer-button usa">Subscribe</button>
                            </div>
                        </div>
                        <div class="footer-columns">
                            <div class="footer-column">
                                <div>
                                <h4 contenteditable="true" class="footer-subheading usa">Product</h4>
                                </div>
                                <ul class="footer-link-column">
                                    <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Features</a></li>
                                    <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Pricing</a></li>
                                    <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Tutorials</a></li>
                                </ul>
                            </div>
                            <div class="footer-column">
                                <div>
                                <h4 contenteditable="true" class="footer-subheading usa">Company</h4>
                                </div>
                                <ul class="footer-link-column">
                                    <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">About</a></li>
                                    <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Blog</a></li>
                                    <li class="usa" contenteditable="true"><a href="#" class="footer-link usa">Careers</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="footer-bottom-bar">
                        <div class="footer-copyright">
                            <div class="card-image footer-logo footer-logo-small">
                                <i class="fa-solid fa-image non-editable" style="color: var(--placeholder-color);"></i>
                            </div>
                            <span contenteditable="true" class="footer-text usa">© 2025 Brand Inc.</span>
                        </div>
                        <div class="footer-social-icons footer-social-compact">
                            <div class="icon-container">
                                <i class="fab fa-facebook"></i>
                            </div>
                            <div class="icon-container">
                                <i class="fab fa-twitter"></i>
                            </div>
                            <div class="icon-container">
                                <i class="fab fa-instagram"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                    <p contenteditable="true" class="footer-legal usa">All rights reserved. <a href="#" class="footer-link usa">Privacy Policy</a> • <a href="#" class="footer-link usa">Terms of Service</a></p>
                    </div>
                </div>
                </div>
            </div>`,
            // SPECIAL GRID FOOTER
            /*html*/
            `<div class="component-footer">
                <div class="footer-wrapper" style="background-color: var(--color-primary);">
                    <div class="footer-container footer-modern">
                        <div class="footer-grid">
                            <div class="footer-brand-block">
                                <div class="card-image footer-logo footer-logo-large">
                                    <i class="fa-solid fa-image non-editable" style="color: var(--placeholder-color);"></i>
                                </div>
                                <div>
                                <h3 contenteditable="true" spellcheck="false" class="footer-heading usa">Design Studio</h3>
                                </div>
                                <div>
                                <p contenteditable="true" class="footer-tagline usa">Creating exceptional experiences through thoughtful design</p>
                                </div>
                            </div>
                            
                            <div class="footer-nav-block">
                                <div>
                                <h4 contenteditable="true" class="footer-subheading usa">Navigation</h4>
                                </div>
                                <div class="footer-nav-grid">
                                    <a href="#" contenteditable="true" class="footer-link footer-nav-item usa">Home</a>
                                    <a href="#" contenteditable="true" class="footer-link footer-nav-item usa">Portfolio</a>
                                    <a href="#" contenteditable="true" class="footer-link footer-nav-item usa">Services</a>
                                    <a href="#" contenteditable="true" class="footer-link footer-nav-item usa">About</a>
                                    <a href="#" contenteditable="true" class="footer-link footer-nav-item usa">Blog</a>
                                    <a href="#" contenteditable="true" class="footer-link footer-nav-item usa">Contact</a>
                                </div>
                            </div>
                            
                            <div class="footer-contact-block">
                                <div>
                                <h4 contenteditable="true" class="footer-subheading usa">Contact Us</h4>
                                </div>
                                <address class="footer-address">
                                    <div class="footer-contact-row">
                                        <div class="icon-container footer-contact-icon"><i class="fas fa-location-dot"></i></div>
                                        <p contenteditable="true" class="footer-text usa">123 Design Avenue<br>Creative District, CA 94103</p>
                                    </div>
                                    <div class="footer-contact-row">
                                        <div class="icon-container footer-contact-icon"><i class="fas fa-envelope"></i></div>
                                        <p contenteditable="true" class="footer-text usa">hello@designstudio.com</p>
                                    </div>
                                    <div class="footer-contact-row">
                                        <div class="icon-container footer-contact-icon"><i class="fas fa-phone"></i></div>
                                        <p contenteditable="true" class="footer-text usa">(555) 123-4567</p>
                                    </div>
                                </address>
                            </div>
                            
                            <div class="footer-social-block">
                                <div>
                                <h4 contenteditable="true" class="footer-subheading usa">Follow Us</h4>
                                </div>
                                <div class="footer-social-grid">
                                    <div class="footer-social-item">
                                        <div class="icon-container footer-icon-container">
                                            <i class="fab fa-instagram"></i>
                                        </div>
                                        <span contenteditable="true" class="footer-social-label usa">Instagram</span>
                                    </div>
                                    <div class="footer-social-item">
                                        <div class="icon-container footer-icon-container">
                                            <i class="fab fa-behance"></i>
                                        </div>
                                        <span contenteditable="true" class="footer-social-label usa">Behance</span>
                                    </div>
                                    <div class="footer-social-item">
                                        <div class="icon-container footer-icon-container">
                                            <i class="fab fa-dribbble"></i>
                                        </div>
                                        <span contenteditable="true" class="footer-social-label usa">Dribbble</span>
                                    </div>
                                    <div class="footer-social-item">
                                        <div class="icon-container footer-icon-container">
                                            <i class="fab fa-pinterest"></i>
                                        </div>
                                        <span contenteditable="true" class="footer-social-label usa">Pinterest</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="footer-bottom-band">
                            <div class="footer-bottom-content">
                                <div>
                                <p contenteditable="true" class="footer-copyright usa">© 2025 Design Studio. All rights reserved.</p>
                                </div>
                                <div class="footer-legal-links">
                                    <a href="#" contenteditable="true" class="footer-link footer-legal-link usa">Privacy</a>
                                    <a href="#" contenteditable="true" class="footer-link footer-legal-link usa">Terms</a>
                                    <a href="#" contenteditable="true" class="footer-link footer-legal-link usa">Cookies</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,

            // 5 · Modern: rounded-top panel with a CTA card, brand, link columns, social pills
            // (fx-*, css/componentVariants.css "MODERN FOOTERS"). Text follows the wrapper's
            // contrast color, so it works on any primary color.
            /*html*/
            `<div class="component-footer">
                <div class="footer-wrapper fx fx-modern" style="background-color: var(--color-primary);">
                    <div class="fx-glow pe-none"></div>
                    <div class="fx-inner">
                        <div class="fx-cta">
                            <div class="heading-wrapper">
                                <h3 contenteditable="true" class="fx-cta-title usa">Ready to get started?</h3>
                            </div>
                            <div>
                                <p contenteditable="true" class="fx-text usa">Join thousands of teams building better every day.</p>
                            </div>
                            <div class="fx-actions">
                                <div contenteditable="true" class="fx-btn usa" style="background-color: var(--color-accent);">Get the app</div>
                                <div class="fx-btn-ghost"><span contenteditable="true" class="usa">Contact us</span><span class="icon-container"><i class="fas fa-arrow-right"></i></span></div>
                            </div>
                        </div>

                        <div class="fx-brand">
                            <div class="card-image footer-logo fx-logo">
                                <i class="fa-solid fa-bolt non-editable"></i>
                            </div>
                            <div class="fx-brand-text">
                                <div class="heading-wrapper">
                                    <h3 contenteditable="true" spellcheck="false" class="fx-brand-name usa">Brand</h3>
                                </div>
                                <div>
                                    <p contenteditable="true" class="fx-tagline usa">Design that moves you forward.</p>
                                </div>
                            </div>
                        </div>

                        <div class="fx-cols">
                            <div class="fx-col">
                                <div><h4 contenteditable="true" class="fx-col-title usa">Product</h4></div>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Features</a>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Pricing</a>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Updates</a>
                            </div>
                            <div class="fx-col">
                                <div><h4 contenteditable="true" class="fx-col-title usa">Company</h4></div>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">About</a>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Careers</a>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Blog</a>
                            </div>
                            <div class="fx-col">
                                <div><h4 contenteditable="true" class="fx-col-title usa">Help</h4></div>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Support</a>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">FAQ</a>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Status</a>
                            </div>
                        </div>

                        <div class="fx-social">
                            <div class="icon-container fx-social-btn"><i class="fab fa-instagram"></i></div>
                            <div class="icon-container fx-social-btn"><i class="fab fa-x-twitter"></i></div>
                            <div class="icon-container fx-social-btn"><i class="fab fa-tiktok"></i></div>
                            <div class="icon-container fx-social-btn"><i class="fab fa-linkedin-in"></i></div>
                            <div class="icon-container fx-social-btn"><i class="fab fa-youtube"></i></div>
                        </div>

                        <div class="fx-bottom">
                            <div><p contenteditable="true" class="fx-copy usa">© 2025 Brand Inc.</p></div>
                            <div class="fx-legal">
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Privacy</a>
                                <a href="#" contenteditable="true" class="footer-link fx-link usa">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        ];


    // VIDEO COMPONENT
    case 'video':
        return [
            // Thumbnail with Play Button Overlay
            /*html*/
            `<div class="fw">
                <div class="video-container">
                    <div class="card-image resizeable video-thumbnail">
                        <span class="non-editable">Click to add image</span>
                    </div>
                    <div class="video-play-button">
                        <div class="icon-container video-play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div contenteditable="true" class="video-title usa">Video Title</div>
                    <div contenteditable="true" class="video-duration usa">60:00</div>
                </div>
            </div>`,
    
            // "Playing" video variant
            /*html*/
            `<div class="video-container">
                <div class="card-image resizeable video-thumbnail">
                    <span class="non-editable">Click to add video thumbnail</span>
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
                <div class="video-gradient-overlay"></div>
                <div class="video-controls">
                    <div class="video-progress-bar">
                        <div class="video-progress">
                            <div class="video-progress-handle"></div>
                        </div>
                    </div>
                    <div class="video-control-buttons">
                        <div class="video-control-left">
                            <div class="icon-container video-control-icon">
                                <i class="fas fa-pause"></i>
                            </div>
                            <div class="icon-container video-control-icon">
                                <i class="fas fa-volume-high"></i>
                            </div>
                            <span contenteditable="true" class="video-time usa">1:15 / 5:00</span>
                        </div>
                        <div class="video-control-right">
                            <div class="icon-container video-control-icon">
                                <i class="fas fa-closed-captioning"></i>
                            </div>
                            <div class="icon-container video-control-icon">
                                <i class="fas fa-gear"></i>
                            </div>
                            <div class="icon-container video-control-icon">
                                <i class="fas fa-expand"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,

            // Standard queue item
            /*html*/
            `<div class="video-queue-item">
                <div class="video-queue-thumbnail-wrapper">
                    <div class="card-image video-queue-thumbnail">
                        <span class="non-editable">Add thumbnail</span>
                        <i class="fa-solid fa-image image-ph non-editable"></i>
                    </div>
                    <span contenteditable="true" class="video-queue-duration usa">5:20</span>
                </div>
                <div class="video-queue-content">
                    <div contenteditable="true" class="video-queue-title usa">Video Title Here</div>
                    <div contenteditable="true" class="video-queue-channel usa">Channel Name</div>
                </div>
            </div>`,

            // Compact queue item with views and date
            /*html*/
            `<div class="video-queue-item">
                <div class="video-queue-thumbnail-wrapper">
                    <div class="card-image video-queue-thumbnail compact">
                        <span class="non-editable">Add thumbnail</span>
                        <i class="fa-solid fa-image image-ph non-editable"></i>
                    </div>
                    <span contenteditable="true" class="video-queue-duration usa">3:45</span>
                </div>
                <div class="video-queue-content">
                    <div contenteditable="true" class="video-queue-title single-line usa">Video Title Here</div>
                    <div class="video-queue-metadata">
                        <div class="icon-container">
                            <i class="fas fa-eye"></i>
                        </div>
                        <span contenteditable="true" class="usa">1.2K views</span>
                        <span>•</span>
                        <span contenteditable="true" class="usa">2 days ago</span>
                    </div>
                </div>
            </div>`,

            // Video Card with Description
            /*html*/
            `<div class="video-card">
                <div class="video-card-thumbnail card-image resizeable">
                    <span class="non-editable">Click to add thumbnail</span>
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>
                <div class="video-card-overlay">
                    <div class="video-play-button vc-btn">
                        <div class="icon-container  video-play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="video-card-content">
                    <div contenteditable="true" class="video-card-title usa">
                        Video Title
                    </div>
                    <div contenteditable="true" class="video-card-description usa">
                        Add a description for your video here. This can include details about the content, duration, or any other relevant information.
                    </div>
                    <div class="video-card-stats">
                        <div class="video-stat-item">
                            <div class="icon-container">
                                <i class="fas fa-eye"></i>
                            </div>
                            <span contenteditable="true" class="usa">100 views</span>
                        </div>
                        <div class="video-stat-item">
                            <div class="icon-container">
                                <i class="fas fa-clock"></i>
                            </div>
                            <span contenteditable="true" class="usa">6:00</span>
                        </div>
                    </div>
                </div>
            </div>`,

            // Active Livestream
                /*html*/
                `<div class="livestream-container">
                <div class="livestream-video resizeable">
                    <div class="livestream-badge">
                        <div class="icon-container">
                            <i class="fas fa-circle livestream-badge-icon"></i>
                        </div>
                        <span contenteditable="true" class="usa">LIVE</span>
                    </div>
                    <div class="livestream-status">
                        <div class="livestream-status-pill">
                            <div class="icon-container">
                                <i class="fas fa-users"></i>
                            </div>
                            <span contenteditable="true" class="usa">1.2K watching</span>
                        </div>
                        <div class="livestream-status-pill">
                            <div class="icon-container">
                                <i class="fas fa-message"></i>
                            </div>
                            <span contenteditable="true" class="usa">Chat</span>
                        </div>
                    </div>
                    <div class="card-image video-thumbnail">
                        <span class="non-editable">Click to add thumbnail</span>
                        <i class="fa-solid fa-image image-ph non-editable"></i>
                    </div>
                    <div class="livestream-controls">
                        <div class="icon-container livestream-control-icon">
                            <i class="fas fa-gear"></i>
                        </div>
                        <div class="livestream-progress"></div>
                        <div class="livestream-status-pill">
                            <div class="icon-container">
                                <i class="fas fa-volume-high"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="livestream-info">
                    <div class="livestream-header">
                        <div class="nav-image livestream-channel-image">
                            <i class="fa-solid fa-image image-ph non-editable"></i>
                        </div>
                        <div class="livestream-channel-info">
                            <div contenteditable="true" class="livestream-title usa">Stream Title</div>
                            <div contenteditable="true" class="livestream-channel-name usa">Channel Name</div>
                        </div>
                    </div>
                    <div class="livestream-actions">
                        <div class="livestream-button livestream-button-primary">
                            <div class="icon-container">
                                <i class="fas fa-heart"></i>
                            </div>
                            <span contenteditable="true" class="usa">Follow</span>
                        </div>
                        <div class="livestream-button livestream-button-secondary">
                            <div class="icon-container">
                                <i class="fas fa-share"></i>
                            </div>
                            <span contenteditable="true" class="usa">Share</span>
                        </div>
                    </div>
                </div>
            </div>`,
    
            // Livestream placeholder
            /*html*/
            `<div class="video-container">
                <div class="video-offline resizeable">
                    <div class="video-offline-badge">
                        <div class="icon-container">
                            <i class="fas fa-slash" style="margin-bottom: 4px; font-size: 8px;"></i>
                        </div>
                        <span contenteditable="true" class="usa">Offline</span>
                    </div>
                    <div class="icon-container video-offline-icon">
                        <i class="fas fa-video-slash"></i>
                    </div>
                    <div contenteditable="true" class="video-offline-text usa">
                        Stream Starting Soon
                    </div>
                    <div class="video-viewer-count">
                        <div class="icon-container">
                            <i class="fas fa-users"></i>
                        </div>
                        <span contenteditable="true" class="usa">1,000 watching</span>
                    </div>
                </div>
            </div>`,

            // Comments section
            /*html*/
            `<div class="video-comments">
                <div class="video-comments-header">
                    <div class="video-comments-title">
                        <span contenteditable="true" class="usa">Comments</span>
                        <span contenteditable="true" class="video-comments-count usa">248</span>
                    </div>
                    <div class="icon-container video-comments-sort">
                        <i class="fas fa-arrow-down-wide-short"></i>
                    </div>
                </div>
                <div class="video-comment-add">
                    <div class="nav-image video-comment-avatar">
                        <i class="fa-solid fa-image image-ph non-editable"></i>
                    </div>
                    <div contenteditable="true" class="video-comment-field usa">Add a comment...</div>
                    <div class="icon-container video-comment-send">
                        <i class="fas fa-paper-plane"></i>
                    </div>
                </div>
                ${[
                    ['@alexrivera', '2 hours ago', 'This is exactly what I needed today. The part at 3:42 blew my mind!', '1,204', '12 replies'],
                    ['@samchen', '5 hours ago', 'Been following this channel for years and the quality just keeps getting better.', '384', '3 replies'],
                    ['@jordan.k', '1 day ago', 'Does anyone know what camera was used for the opening shot?', '57', '']
                ].map(([name, time, text, likes, replies]) => `
                <div class="video-comment">
                    <div class="nav-image video-comment-avatar">
                        <i class="fa-solid fa-image image-ph non-editable"></i>
                    </div>
                    <div class="video-comment-body">
                        <div class="video-comment-meta">
                            <span contenteditable="true" class="video-comment-name usa">${name}</span>
                            <span contenteditable="true" class="video-comment-time usa">${time}</span>
                        </div>
                        <div contenteditable="true" class="video-comment-text usa">${text}</div>
                        <div class="video-comment-actions">
                            <span class="icon-container"><i class="fas fa-thumbs-up"></i><div class="usa" style="display: inline;"> ${likes}</div></span>
                            <span class="icon-container"><i class="fas fa-thumbs-down"></i></span>
                            <span contenteditable="true" class="video-comment-reply usa">Reply</span>
                        </div>${replies ? `
                        <div class="video-comment-replies">
                            <div class="icon-container"><i class="fas fa-chevron-down"></i></div>
                            <span contenteditable="true" class="usa">${replies}</span>
                        </div>` : ''}
                    </div>
                </div>`).join('')}
            </div>`
        ];

        // Textarea variants  TEXTAREA: text area///// // // //
        case 'textarea':
            return [
                // Default Original textarea
                /*html*/
                `<div class="fw ta">
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base empty" data-placeholder="Enter your text here..." style="border-bottom: 2px solid var(--color-primary);">
                    </div>
                    <div class="resize-handle">
                        <div class="resize-indicator"></div>
                    </div>
                </div>`,
                
                // Textarea with label
                /*html*/
                `<div class="fw ta">
                    <div class="ui-input-label usa">Label</div>
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base empty" data-placeholder="Enter your text here..." style="border-bottom: 2px solid var(--color-primary);">
                    </div>
                    <div class="resize-handle rh-mod">
                        <div class="resize-indicator"></div>
                    </div>
                    <div class="ui-input-character-count usa">0/500 characters</div>
                </div>`,

                // Required textarea with asterisk
                /*html*/
                `<div class="fw ta">
                    <div class="ui-input-required-label">
                        <div class="ui-input-required-asterisk">*</div>
                        <div class="ui-input-label usa">Required</div>
                    </div>
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base empty" data-placeholder="Enter your text here..." style="border-bottom: 2px solid var(--color-primary);">
                    </div>
                    <div class="resize-handle">
                        <div class="resize-indicator"></div>
                    </div>
                </div>`,

                // Focused textarea
                /*html*/
                `<div class="fw ta">
                    <div class="ui-input-label usa">Label</div>
                    <div class="ui-input-focused-wrapper">
                        <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base empty" data-placeholder="Selected Field" style="border: 2px solid var(--color-primary);">
                        </div>
                        <div class="resize-handle">
                            <div class="resize-indicator"></div>
                        </div>
                    </div>
                </div>`,
                
                // Outlined textarea
                /*html*/
                `<div class="fw ta">
                    <div class="ui-input-label usa">Label</div>
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base ui-input-outlined empty" data-placeholder="Enter your text here..." style="border: 2px solid var(--color-primary);">
                    </div>
                    <div class="resize-handle rh-mod">
                        <div class="resize-indicator"></div>
                    </div>
                    <div class="ui-input-character-count usa">0/500 characters</div>
                </div>`,

                // Error textarea
                /*html*/
                `<div class="fw ta">
                    <div class="ui-input-label usa">Label</div>
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base ui-input-error empty" data-placeholder="Enter your text here...">
                    </div>
                    <div class="resize-handle rh-mod">
                        <div class="resize-indicator"></div>
                    </div>
                    <div class="ui-input-error-message">
                        <i class="fas fa-exclamation-triangle ui-input-error-icon"></i>
                        <div contenteditable="true" class="usa">Please enter a valid value</div>
                    </div>
                </div>`,

                // Disabled textarea
                /*html*/
                `<div class="fw ta">
                    <div class="ui-input-label usa">Label</div>
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base ui-input-disabled empty" data-placeholder="Disabled" style="border-color: var(--color-secondary);">
                    </div>
                </div>`,

                // Success textarea
                /*html*/
                `<div class="fw ta">
                    <div class="ui-input-label usa">Label</div>
                    <div class="ui-input-password-wrapper">
                        <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base ui-input-success empty" data-placeholder="Success">
                        </div>
                        <div class="icon-container ui-input-success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="resize-handle rh-mod">
                        <div class="resize-indicator"></div>
                    </div>
                    <div class="ui-input-success-message usa">Success message</div>
                </div>`,

                // Rich Text Editor
                /*html*/
                `<div class="rich-text-editor">
                    <div class="rich-text-toolbar">
                        <div class="rich-text-group">
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-bold"></i>
                            </button>
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-italic"></i>
                            </button>
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-underline"></i>
                            </button>
                            <div class="rich-text-divider"></div>
                        </div>
                        <div class="rich-text-group">
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-align-left"></i>
                            </button>
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-align-center"></i>
                            </button>
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-align-right"></i>
                            </button>
                            <div class="rich-text-divider"></div>
                        </div>
                        <div class="rich-text-group">
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-list-ul"></i>
                            </button>
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-list-ol"></i>
                            </button>
                            <div class="rich-text-divider"></div>
                        </div>
                        <div class="rich-text-group">
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-link"></i>
                            </button>
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-image"></i>
                            </button>
                            <button class="rich-text-btn icon-container">
                                <i class="fas fa-code"></i>
                            </button>
                        </div>
                    </div>
                    <div contenteditable="true" spellcheck="false" class="rich-text-content empty" data-placeholder="Start typing...">
                    </div>
                    <div class="resize-handle">
                        <div class="resize-indicator"></div>
                    </div>
                </div>`
            ];

        case 'keyboard':
            return [
                // Variant 1: QWERTY Keyboard
                /*html*/
                `<div class="keyboard-layout keyboard-layout-qwerty">
                    <div class="keyboard-row">
                    ${['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => 
                        `<div class="keyboard-key">${key}</div>`
                    ).join('')}
                    </div>
                    
                    <div class="keyboard-row" style="width: calc(100% - 24px); padding-left: 12px; padding-right: 12px;">
                    ${['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => 
                        `<div class="keyboard-key">${key}</div>`
                    ).join('')}
                    </div>

                    <div class="keyboard-row">
                    <div class="keyboard-key key-shift" style="flex: 1.2; min-width: 26px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><i class="fas fa-arrow-up"></i></div>
                    ${['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(key => 
                        `<div class="keyboard-key">${key}</div>`
                    ).join('')}
                    <div class="keyboard-key key-delete" style="flex: 1.2; min-width: 26px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><i class="fas fa-backspace"></i></div>
                    </div>
    
                    <div class="keyboard-row">
                    <div class="keyboard-key key-numbers" style="flex: 1.5; min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">123</div>
                    <div class="keyboard-key key-globe" style="flex: 1; min-width: 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><i class="fas fa-globe"></i></div>
                    <div class="keyboard-key key-space" style="flex: 5; min-width: 110px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">space</div>
                    <div class="keyboard-key key-return" style="flex: 1.5; min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">return</div>
                    </div>

                </div>`,
                
                // Variant 2: Numeric Keyboard
                /*html*/
                `<div class="keyboard-layout keyboard-layout-numeric">

                    <div class="keyboard-row">
                    ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(key => 
                        `<div class="keyboard-key">${key}</div>`
                    ).join('')}
                    </div>
                    
                    <div class="keyboard-row">
                    ${['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'].map(key => 
                        `<div class="keyboard-key">${key}</div>`
                    ).join('')}
                    </div>
                    
                    <div class="keyboard-row">
                    <div class="keyboard-key key-symbols" style="flex: 1.5; background-color: var(--color-background); min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">#+=</div>
                    ${['.', ',', '?', '!', "'", '`'].map(key => 
                        `<div class="keyboard-key">${key}</div>`
                    ).join('')}
                    <div class="keyboard-key key-delete" style="flex: 1.5; background-color: var(--color-background); min-width: 33px;"><i class="fas fa-backspace"></i></div>
                    </div>
                    
                    <div class="keyboard-row">
                    <div class="keyboard-key key-abc" style="flex: 1.5; background-color: var(--color-background); min-width: 33px;">ABC</div>
                    <div class="keyboard-key key-emoji" style="flex: 1; background-color: var(--color-background); min-width: 22px;"><i class="far fa-smile"></i></div>
                    <div class="keyboard-key key-space" style="flex: 5; background-color: var(--color-background); min-width: 110px;">space</div>
                    <div class="keyboard-key key-return" style="flex: 1.5; background-color: var(--color-background); min-width: 33px;">return</div>
                    </div>

                    <button class="delete-btn" contenteditable="true">×</button>
                </div>`,
                
                // Variant 3: Compact numeric keypad (e.g., for PIN entry)
                /*html*/
                `<div class="keyboard-layout keyboard-layout-compact-numeric">
                    <div class="keyboard-row">
                    <div class="keyboard-key">1</div>
                    <div class="keyboard-key">2</div>
                    <div class="keyboard-key">3</div>
                    </div>
                    <div class="keyboard-row">
                    <div class="keyboard-key">4</div>
                    <div class="keyboard-key">5</div>
                    <div class="keyboard-key">6</div>
                    </div>
                    <div class="keyboard-row">
                    <div class="keyboard-key">7</div>
                    <div class="keyboard-key">8</div>
                    <div class="keyboard-key">9</div>
                    </div>
                    <div class="keyboard-row">
                    <div class="keyboard-key">.</div>
                    <div class="keyboard-key">0</div>
                    <div class="keyboard-key key-delete" ><i class="fas fa-backspace"></i></div>
                    </div>
                    <button class="delete-btn" contenteditable="true">×</button>
                </div>`,
            //Emoji Keyboard
            /*html*/
            `<div class="keyboard-layout keyboard-layout-emoji">
                <!-- Tabs for emoji categories -->
                <div class="emoji-categories">
                    <div class="emoji-category active">
                        <i class="far fa-smile" style="color: var(--color-primary);"></i>
                    </div>
                    <div class="emoji-category">
                        <i class="fas fa-paw"></i>
                    </div>
                    <div class="emoji-category">
                        <i class="fas fa-hamburger"></i>
                    </div>
                    <div class="emoji-category">
                        <i class="fas fa-futbol"></i>
                    </div>
                    <div class="emoji-category">
                        <i class="fas fa-car"></i>
                    </div>
                    <div class="emoji-category">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="emoji-category">
                        <i class="fas fa-flag"></i>
                    </div>
                </div>
                <!-- Emoji grid - Faces/Emotions -->
                <div class="emoji-grid">
                    <div class="emoji-item">😀</div>
                    <div class="emoji-item">😂</div>
                    <div class="emoji-item">😊</div>
                    <div class="emoji-item">🥰</div>
                    <div class="emoji-item">😍</div>
                    <div class="emoji-item">🤩</div>
                    <div class="emoji-item">🙄</div>
                    <div class="emoji-item">😮</div>
                    <div class="emoji-item">🥳</div>
                    <div class="emoji-item">😭</div>
                    <div class="emoji-item">😡</div>
                    <div class="emoji-item">🥺</div>
                    <div class="emoji-item">😴</div>
                    <div class="emoji-item">🤔</div>
                    <div class="emoji-item">😑</div>
                    <div class="emoji-item">🤗</div>
                    <div class="emoji-item">😎</div>
                    <div class="emoji-item">🤯</div>
                    <div class="emoji-item">😘</div>
                    <div class="emoji-item">😏</div>
                    <div class="emoji-item">🙂</div>
                    <div class="emoji-item">🤪</div>
                    <div class="emoji-item">😋</div>
                    <div class="emoji-item">🤮</div>
                </div>
                <!-- Search and navigation row -->
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <div class="keyboard-key emoji-search">
                        <i class="fas fa-search" style="font-size: 12px;"></i>
                        <span>Search emoji</span>
                    </div>
                    <div class="keyboard-key emoji-recent" style="flex: 1; background-color: var(--color-background); color: var(--basic-txt-color); border-radius: 6px; padding: 8px 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <i class="fas fa-clock"></i>
                    </div>
                </div>
                <!-- Keyboard Controls -->
                <div class="keyboard-row">
                    <div class="keyboard-key key-abc" style="flex: 1.5; min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">ABC</div>
                    <div class="keyboard-key key-numbers" style="flex: 1.5; min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">123</div>
                    <div class="keyboard-key key-space" style="flex: 4; min-width: 100px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">space</div>
                    <div class="keyboard-key key-return" style="flex: 1.5; min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">return</div>
                </div>
                <button class="delete-btn" contenteditable="true">×</button>
            </div>`,

            // Voice Input Keyboard (with minimalist design)
            // <!-- Listening animation (hidden by default) -->
            //         <div class="voice-waves" style="position: absolute; width: 120px; height: 120px; border-radius: 60px; border: 2px dotted var(--color-primary); opacity: 0.6; display: none;"></div>
            /*html*/
            `<div class="keyboard-layout keyboard-layout-voice">
                <!-- Voice input area -->
                <div class="voice-input-area">
                    <!-- Microphone button -->
                    <div class="microphone-button icon-container" style="background-color: var(--color-primary);">
                        <i class="fas fa-microphone"></i>
                    </div>
                    <!-- Voice instructions -->
                    <div style="margin-top: 12px; font-size: 14px; color: var(--basic-txt-color);">Tap to speak</div>
                </div>
                <!-- Keyboard Controls -->
                <div class="keyboard-row">
                    <div class="keyboard-key key-abc" style="flex: 1.5; min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">ABC</div>
                    <div class="keyboard-key key-numbers" style="flex: 1.5; min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">123</div>
                    <div class="keyboard-key key-space" style="flex: 4; min-width: 100px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">space</div>
                    <div class="keyboard-key key-return" style="flex: 1.5; min-width: 33px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">return</div>
                </div>
                <button class="delete-btn" contenteditable="true">×</button>
            </div>`,
            //Calculator layout
            /*html*/
            `<div class="keyboard-layout keyboard-layout-calculator">
                <div class="keyboard-row">
                <div class="keyboard-key">C</div>
                <div class="keyboard-key">±</div>
                <div class="keyboard-key">%</div>
                <div class="keyboard-key calc-key" style="background-color: var(--color-primary);">÷</div>
                </div>
                <div class="keyboard-row">
                <div class="keyboard-key">7</div>
                <div class="keyboard-key">8</div>
                <div class="keyboard-key">9</div>
                <div class="keyboard-key calc-key" style="background-color: var(--color-primary);">×</div>
                </div>
                <div class="keyboard-row">
                <div class="keyboard-key">4</div>
                <div class="keyboard-key">5</div>
                <div class="keyboard-key">6</div>
                <div class="keyboard-key calc-key" style="background-color: var(--color-primary);">−</div>
                </div>
                <div class="keyboard-row">
                <div class="keyboard-key">1</div>
                <div class="keyboard-key">2</div>
                <div class="keyboard-key">3</div>
                <div class="keyboard-key calc-key" style="background-color: var(--color-primary);">+</div>
                </div>
                <div class="keyboard-row">
                <div class="keyboard-key" style="flex: 2; color: var(--basic-txt-color); border-radius: 6px; padding: 12px 8px; margin: 4px; text-align: center; font-weight: 500; user-select: none; cursor: pointer;">0</div>
                <div class="keyboard-key">.</div>
                <div class="keyboard-key calc-key" style="background-color: var(--color-primary);">=</div>
                </div>
                <button class="delete-btn" contenteditable="true">×</button>
            </div>`,
            //Phone Dialer Keyboard
            /*html*/
            `<div class="keyboard-layout keyboard-layout-phone-dialer">
                <!-- Phone number display -->
                <div class="phone-number-display">
                    <span class="usa" contenteditable="true">+1 555 123 4567</span>
                    <div class="backspace-button">
                        <i class="fas fa-backspace"></i>
                    </div>
                </div>
                <!-- Dialer grid -->
                <div class="dialer-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                    <!-- Row 1 -->
                    <div class="dialer-key">
                        <div class="dialer-num">1</div>
                        <div class="dialer-letters"></div>
                    </div>
                    <div class="dialer-key">
                        <div class="dialer-num">2</div>
                        <div class="dialer-letters">ABC</div>
                    </div>
                    <div class="dialer-key">
                        <div class="dialer-num">3</div>
                        <div class="dialer-letters">DEF</div>
                    </div>
                    <!-- Row 2 -->
                    <div class="dialer-key">
                        <div class="dialer-num">4</div>
                        <div class="dialer-letters">GHI</div>
                    </div>
                    <div class="dialer-key">
                        <div class="dialer-num">5</div>
                        <div class="dialer-letters">JKL</div>
                    </div>
                    <div class="dialer-key">
                        <div class="dialer-num">6</div>
                        <div class="dialer-letters">MNO</div>
                    </div>
                    <!-- Row 3 -->
                    <div class="dialer-key">
                        <div class="dialer-num">7</div>
                        <div class="dialer-letters">PQRS</div>
                    </div>
                    <div class="dialer-key">
                        <div class="dialer-num">8</div>
                        <div class="dialer-letters">TUV</div>
                    </div>
                    <div class="dialer-key">
                        <div class="dialer-num">9</div>
                        <div class="dialer-letters">WXYZ</div>
                    </div>
                    <!-- Row 4 -->
                    <div class="dialer-key">
                        <div class="dialer-num">*</div>
                        <div class="dialer-letters"></div>
                    </div>
                    <div class="dialer-key">
                        <div class="dialer-num">0</div>
                        <div class="dialer-letters">+</div>
                    </div>
                    <div class="dialer-key">
                        <div class="dialer-num">#</div>
                        <div class="dialer-letters"></div>
                    </div>
                </div>
                <!-- Call button -->
                <div class="call-button icon-container" style="background-color: var(--color-primary); border-radius: 8px; padding: 12px 0; text-align: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    <i class="fas fa-phone-alt" style="font-size: 24px; color: var(--basic-txt-color);"></i>
                </div>
                <button class="delete-btn" contenteditable="true">×</button>
            </div>`,
        ];

    //SEARCH BAR / / / // // // // // // // // // // // // // // // // // // // //
        case 'searchBar':
            return [
            // Search input
            /*html*/
                `<div class="fw">
                    <div class="search-container">
                        <i class="fas fa-search search-icon"></i>
                        <div contenteditable="true" spellcheck="false" class="search-input empty" data-placeholder="Search..."></div><i class="fas fa-xmark search-clear non-editable" role="button" aria-label="Clear search" title="Clear search"></i>
                    </div>
                </div>`,
            // Minimal underline
            /*html*/
            `<div class="fw">
                <div class="search-minimal">
                    <i class="fas fa-search search-minimal-icon"></i>
                    <div contenteditable="true" spellcheck="false" class="search-minimal-input empty" data-placeholder="Search for items..."></div><i class="fas fa-xmark search-clear non-editable" role="button" aria-label="Clear search" title="Clear search"></i>
                </div>
            </div>`,
            // Squared Style with Filled Background
            /*html*/
            `<div class="fw">
                <div class="search-squared">
                    <i class="fas fa-search search-squared-icon"></i>
                    <div contenteditable="true" spellcheck="false" class="search-squared-input empty" data-placeholder="What are you looking for?"></div><i class="fas fa-xmark search-clear non-editable" role="button" aria-label="Clear search" title="Clear search"></i>
                </div>
            </div>`,
            // Compact Style
            /*html*/
            `<div class="search-compact">
                <i class="fas fa-search search-compact-icon"></i>
                <div contenteditable="true" spellcheck="false" class="search-compact-input empty" data-placeholder="Quick search..."></div><i class="fas fa-xmark search-clear non-editable" role="button" aria-label="Clear search" title="Clear search"></i>
            </div>`,
            ];

        // case 'tabs':
        //     return [`<div>TABBY</div>`,`<div>TABBY3</div>`, ];
    default:
        // Components whose variants live in their own module (js/components/<type>.js)
        return window.Components?.[type]?.variants?.() || null;
    }
}
