 /// templates ///
    // Template Modal Implementation
function createTemplateModal() {
    const modal = document.createElement('div');
    modal.id = 'template-modal';
    modal.className = 'modal';
    
    modal.innerHTML = /*HTML*/`
      <div class="modal-content">
        <div class="modal-header">
          <h2>Templates</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="templates-container">

          <div class="template-card" data-template="template1">
            <h3>Profile</h3>
            <p>Image, Avatar, Pills, and Paragraph</p>
            
            <div class="template-preview">
            <div class="tp-scale">
                
                <div class="fw">
                    <div style="height: 108px; border-radius: 6px 6px 0 0" class="card-image ui-image-full">
                        <i class="fa-solid fa-image image-ph"></i>
                    </div>
                </div>
                <br>
                <div class="success-container fw">
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
                        <span class="avatar-text">Display Name</span>
                        </div>
                    </div>
                </div>

                <br>

                <div class="chip-group-container">
                    <div class="chip" style="background-color: var(--color-primary);">
                        <span class="chip-text">Pill</span>
                    </div>
                    <div class="chip" style="background-color: var(--color-primary);">
                        <span class="chip-text">Pill</span>
                    </div>
                    <div class="chip" style="background-color: var(--color-primary);">
                        <span class="chip-text">Pill</span>
                    </div>
                </div>

                <h1 style="margin: 2px 0">Heading Text</h1>
                <p>This is a paragraph. Click to edit.</p>

                <div class="image-gallery-wrapper" style="width: 100%; position: relative;">
                <div class="image-gallery-con">
                    <div class="ig-left-column-con">
                        <div class="ig-image-wrapper">
                            <div class="card-image resizeable ig-img-box" style="height: 68px;">
                                <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                            </div>
                        </div>
                        <div class="ig-image-wrapper">
                            <div class="card-image resizeable ig-img-box" style="height: 68px;">
                                <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                            </div>
                        </div>
                    </div>
                    <div class="ig-right-column-con">
                        <div class="ig-image-wrapper">
                            <div class="card-image resizeable ig-img-box" style="height: 68px;">
                                <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                            </div>
                        </div>
                        <div class="ig-image-wrapper">
                            <div class="card-image resizeable ig-img-box" style="height: 68px;">
                                <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br>
                <div class="ui-button-container">
                    <div class="ui-button">
                        <div role="button" class="ui-button" style="background-color: var(--color-primary);">
                        <div style="display: inline; margin: 0 6px 0 0;">
                            BUTTON
                        </div>
                        <div contenteditable="false" style="display: inline; margin: 0 0 0 6px;">
                            <i  contenteditable="false" class="fas fa-hand-point-left" style="font-size: 18px;"></i>
                        </div>
                        </div>
                    </div>
                </div>

                </div>
            </div>
          </div>



          <div class="template-card" data-template="template2">
            <h3>Content</h3>
            <p>Hero, Heading, Accordion, and Footer</p>
            <div class="template-preview">
            <div class="tp-scale">
                <div class="hero hero-base justify-center" style="padding: 28px 0px; border-radius: 6px 6px 0 0;">
                    <div class="hero-gradient" style="background: linear-gradient(135deg, var(--color-primary) 0%, transparent 90%); border-radius: 6px 6px 0 0;"></div>
                    <div class="hero-content">
                        <div class="heading-wrapper">
                            <h2 class="hero-heading" style="font-size: 28px;">Hero</h2>
                        </div>
                        <div>
                            <p class="hero-paragraph">A hero with a call-to-action button.</p>
                        </div>
                        <div class="hero-button">Get Started</div>
                    </div>
                </div>
                <h2>Heading Text</h2>
                <p>This is a paragraph. Click to edit.</p>
                <div class="fas fa-bolt-lightning" style="width: 100%; color: var(--color-accent); font-size: 24px; text-align: center; margin-bottom: 16px;"></div>
                <div class="accordion-container">
                    <div class="accordion-header">
                        <span>Accordion</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                <br>
                <footer>
                <div style="width: 100%; height: 100%; background-color: var(--color-primary); z-index: 1; padding: 0 10px; transform: translatex(-10px); position: relative; margin-bottom: -33px; border-radius: 0 0 6px 6px">
            <div style="display: flex; justify-content: space-between; width: 100%; padding: 10px 0; z-index: 2; position: relative;">
                <div style="text-align: left;">
                    <div class="card-image" style="margin-bottom: 10px; background-color: var(--neutral-gray); width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                    <i style="color: var(--placeholder-color);" class="fa-solid fa-image non-editable"></i>
                    </div>
                    <div>
                    <h4 spellcheck="false" contenteditable style="margin: 0; color: var(--basic-txt-color); ">Brand</h4>
                    </div>
                </div>
                <div style="display: flex; gap: 8px; font-size: 10px; padding: 2px 6px;">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: var(--basic-txt-color);  text-decoration: none;">About Us</a></li>
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: var(--basic-txt-color);  text-decoration: none;">Contact</a></li>
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: var(--basic-txt-color);  text-decoration: none;">Careers</a></li>
                    </ul>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: var(--basic-txt-color);  text-decoration: none;">Support</a></li>
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: var(--basic-txt-color);  text-decoration: none;">Privacy Policy</a></li>
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: var(--basic-txt-color);  text-decoration: none;">Terms of Use</a></li>
                    </ul>
                </div>
            </div>
                <div style="display: flex; gap: 40px; justify-content: center; padding: 14px 0 18px 0; border-top: 1px solid var(--neutral-gray);">
                    <div class="icon-container">
                        <i class="fas fa-seedling""></i>
                    </div>
                    <div class="icon-container">
                        <i class="fas fa-bolt-lightning"></i>
                    </div>
                    <div class="icon-container">
                        <i class="fas fa-skull"></i>
                    </div>
                </div>
            </div>
            <br>
            </footer>
            </div>
            </div>
          </div>



          <div class="template-card" data-template="template3">
            <h3>Form</h3>
            <p>Heading, Form Elements, Submit Button</p>
            <div class="template-preview">
            <div class="tp-scale">
                <h1 style="font-size: 24px">Form Template</h1>
                <div class="ui-input-wrapper" style="margin-bottom: 12px;">
                <div class="ui-input-required-label">
                <div class="ui-input-required-asterisk">*</div>
                    <div class="ui-input-label">Required</div>
                </div>
                <div spellcheck="false" class="ui-input-base empty" data-placeholder="Placeholder" style="border-bottom: 2px solid var(--color-primary);">
                </div>
            </div>
            <div class="fw ta" style="margin-bottom: 12px;">
                    <div class="ui-input-label">Label</div>
                    <div contenteditable="true" spellcheck="false" class="ui-input-base ta-base empty" data-placeholder="Enter your text here..." style="border-bottom: 2px solid var(--color-primary);height: 24px;">
                    </div>
                    <div class="resize-handle rh-mod">
                        <div class="resize-indicator"></div>
                    </div>
                    <div class="ui-input-character-count">0/500 characters</div>
                </div>
                <label class="field-label-element">Label Text</label>
                <div class="custom-dropdown-container"><div class="dropdown-header"><div class="selected-text">Dropdown</div><i class="fas fa-chevron-down"></i></div>
                </div>
                <label class="field-label-element">Label Text</label>
                <div style="display: flex; flex-direction: column; gap: 4px; margin-left: 4px;">
                <i class="fa-regular fa-square" style="font-size: 18px; color: #a0a0a0;"></i>
                <i class="fa-regular fa-square" style="font-size: 18px; color: #a0a0a0;"></i>
                <i class="fa-regular fa-square" style="font-size: 18px; color: #a0a0a0;"></i>
                </div>
                <br>

                    <div class="ui-button">
                    <div role="button" class="ui-button usa" style="background-color: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); height: 34px;">
                        BTN
                    </div>
                    <div role="button" class="ui-button usa" style="background-color: var(--color-primary); height: 34px;">
                        BTN
                    </div>
                    </div>

            </div>
            </div>
          </div>



          <div class="template-card" data-template="social">
            <h3>Social</h3>
            <p>Chat, Cards, and Social Feed</p>
            <div class="template-preview">
            <div class="tp-scale">
              <div style="display: flex; justify-content: space-between; width: 100%; padding-top: 6px; background: var(--color-background)">
              <span spellcheck="false" style="font-size: 20px; font-weight: bold; color: var(--color-primary);">Brand</span>

                  <div>
                      <i class="fas fa-bars" style="font-size: 20px; color: var(--color-primary);"></i>
                  </div>

              </div>
                <h1>Social Feed</h1>
                <div class="card-con">
            <div class="card-image card-img-placeholder" style="height: 86px;">
                <i class="fa-solid fa-image image-ph non-editable"></i>
            </div>
            <div class="card-content" style="padding: 6px;">
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
                <p class="card-text usa">A social media style card.</p>
                </div>
                <div class="card-social-actions">
                <span class="icon-container"><i class="fas fa-heart"></i>&emsp;<div style="display: inline;">24</div></span>
                <span class="icon-container"><i class="fas fa-comment"></i>&emsp;<div style="display: inline;">3</div></span>
                <span class="icon-container"><i class="fas fa-share-nodes"></i></span>
                </div>
            </div>
            </div>
            <br>
            <div class="card-stats">
                <div class="card-stat-header">
                    <div class="icon-container">
                      <i class="fa-solid fa-chart-line" style="color: var(--color-primary)"></i>
                    </div>
                    <div>
                    <h1>95%</h1>
                    </div>
                </div>
                <div>
                <p class="card-text" style="text-align: center;">User Satisfaction</p>
                </div>
            </div>
            <br>
              <div class="chat-input-con" style="justify-content: space-between;">
                  <input type="text" placeholder="Message..." class="chat-input" style="max-width: 80px;">
                  <button class="chat-send-btn icon-container" style="background-color: var(--color-primary); color: white;">
                      <i class="fas fa-paper-plane chat-send-icon"></i>
                  </button>
              </div>
            </div>
            </div>
          </div>



          <div class="template-card" data-template="dashboard">
            <h3>Dashboard</h3>
            <p>Charts, Graphs, and Data Visualization</p>

            <div class="template-preview">
            <div class="tp-scale">
              <h1 style="font-size: 24px; margin-bottom: 10px;">Dashboard</h1>
              <p>This is a paragraph. Click to edit.</p>
              <div class="progress-group" style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">

              <div class="progress-bar resizeable" style="width: 100%; height: 80px; position: relative; align-items: center; justify-content: center;">
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
                  <div contenteditable="true" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; font-size: 24px; font-weight: bold; color: var(--basic-txt-color);">76%</div>
              </div>
          </div>

              <div class="progress-group" style="margin-bottom: 10px;">
                <div class="progress-bar" style="width: 100%; height: 6px; background-color: var(--neutral-gray); border-radius: 5px; overflow: hidden;">
                  <div style="width: 76%; height: 100%; background-color: var(--color-primary); transition: width 0.3s ease;"></div>
                </div>
                <div style="margin-top: 5px; font-weight: bold; color: var(--basic-txt-color);">76%</div>
              </div>

            <div style="height: 80px; position: relative; margin-bottom: 10px; background-color: var(--input-bg-color); border-radius: 4px; padding: 8px; border: 0.12rem solid var(--neutral-gray);">
              <div style="position: absolute; bottom: 0; left: 25%; width: 10%; height: 60%; background-color: var(--color-primary); border-radius: 4px 4px 0 0;"></div>
              <div style="position: absolute; bottom: 0; left: 40%; width: 10%; height: 30%; background-color: var(--color-primary); border-radius: 4px 4px 0 0;"></div>
              <div style="position: absolute; bottom: 0; left: 55%; width: 10%; height: 70%; background-color: var(--color-primary); border-radius: 4px 4px 0 0;"></div>
              <div style="position: absolute; bottom: 0; left: 70%; width: 10%; height: 50%; background-color: var(--color-primary); border-radius: 4px 4px 0 0;"></div>
              <div style="position: absolute; bottom: 0; left: 70%; width: 10%; height: 92%; background-color: var(--color-primary); border-radius: 4px 4px 0 0;"></div>
            </div>

              <p style="font-size: 14px; margin: 10px 0;">View detailed performance metrics.</p>

              <table class="data-table-main" style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <thead>
                <tr>
                  <th style="padding: 5px; text-align: left; background-color: var(--color-primary); color: white;">ID</th>
                  <th style="padding: 5px; text-align: left; background-color: var(--color-primary); color: white;">Name</th>
                  <th style="padding: 5px; text-align: right; background-color: var(--color-primary); color: white;">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr style="color: var(--basic-txt-color);">
                  <td style="padding: 5px; border-bottom: 1px solid var(--neutral-gray);">001</td>
                  <td style="padding: 5px; border-bottom: 1px solid var(--neutral-gray);">Item One</td>
                  <td style="padding: 5px; border-bottom: 1px solid var(--neutral-gray); text-align: right;">$1,200</td>
                </tr>
                <tr style="color: var(--basic-txt-color);">
                  <td style="padding: 5px; border-bottom: 1px solid var(--neutral-gray);">002</td>
                  <td style="padding: 5px; border-bottom: 1px solid var(--neutral-gray);">Item Two</td>
                  <td style="padding: 5px; border-bottom: 1px solid var(--neutral-gray); text-align: right;">$950</td>
                </tr>
              </tbody>
            </table>

              </div>
            </div>
          </div>



          <div class="template-card" data-template="ecommerce">
            <h3>E-commerce</h3>
            <p>Product Gallery, Search, and Filters</p>
            <div class="template-preview">
            <div class="tp-scale">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px;">
            <span style="font-size: 18px; font-weight: bold; color: var(--color-primary);">Brand</span>
            <div style="display: flex; gap: 15px;">
              <a href="#" style="color: var(--basic-txt-color); text-decoration: none;">Home</a>
              <div class="icon-container">
                <i class="fas fa-bars" style="font-size: 18px; color: var(--color-primary);"></i>
              </div>
            </div>
          </div>
          
          <h1 style="font-size: 22px; margin: 0 0 5px 0;">Product Gallery</h1>
          
          <div class="fw" style="margin-bottom: 10px;">
            <div class="search-container" style="height: 30px;">
              <i class="fas fa-search search-icon" style="font-size: 12px;"></i>
              <div class="search-input empty" data-placeholder="Search products..." style="font-size: 12px; height: 30px;"></div>
            </div>
          </div>
          
          <div class="chip-group-container" style="display: flex; gap: 8px; margin-bottom: 10px;">
            <div class="chip" style="background-color: var(--color-primary);">
              <span class="chip-text" style="color: white; font-size: 12px;">All</span>
            </div>
            <div class="chip" style="background-color: var(--neutral-gray);">
              <span class="chip-text" style="font-size: 12px;">Clothing</span>
            </div>
            <div class="chip" style="background-color: var(--neutral-gray);">
              <span class="chip-text" style="font-size: 12px;">Electronics</span>
            </div>
          </div>
          
          <div class="adjustableSpace" style="height: 10px;"></div>
          
          <div class="card-con card-hz" style="margin-bottom: 8px;">
            <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 60px; height: auto; display: flex; justify-content: center; align-items: center;">
              <i class="fa-solid fa-image image-ph"></i>
            </div>
            <div class="card-hz-content">
              <div>
                <h3 class="card-title" style="font-size: 14px; margin: 0;">Product Name</h3>
              </div>
            </div>
          </div>
          
          <div class="card-con" style="width: 100%; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
            <div class="card-simple" style="padding: 10px;">
              <div class="card-icon-header">
                <div class="icon-container card-icon-large" style="color: var(--color-primary);">
                  <i class="fas fa-cube"></i>
                </div>
                <div style="width: 100%;">
                  <h3 class="card-title" style="font-size: 14px; margin: 0;">Featured Product</h3>
                </div>
              </div>
              <div>
                <p class="card-text" style="font-size: 12px; margin: 5px 0 0 0;">High quality premium item</p>
              </div>
            </div>
          </div>
          
          <div class="card-con card-hz" style="margin-bottom: 8px;">
            <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 60px; height: auto; display: flex; justify-content: center; align-items: center;">
              <i class="fa-solid fa-image image-ph"></i>
            </div>
            <div class="card-hz-content">
              <div>
                <h3 class="card-title" style="font-size: 14px; margin: 0;">Product Name</h3>
              </div>
            </div>
          </div>
          
          <div class="card-con" style="width: 100%; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden; margin-bottom: 10px;">
            <div class="card-quote">
              <div class="card-quote-text">
                <h4>
                  <span style="margin-left: -12px;">"&hairsp;</span>This is a quote card for customer testimonials.&hairsp;"
                </h4>
              </div>
              <div class="card-quote-author">
                <p>— Happy Customer</p>
              </div>
            </div>
          </div>
          
          <div class="feature-comparison-card" style="border: 1px solid var(--color-primary); border-radius: 8px; overflow: hidden; margin-bottom: 10px;">
            <div style="background-color: var(--color-primary); color: white; padding: 8px 0; text-align: center; font-weight: bold; widht: 100%;">
              Comparison
            </div>
            <div class="comparison-card-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 5px 4px; font-size: 10px;">
              <div style="padding: 5px; font-weight: bold; color: var(--basic-txt-color);">Features</div>
              <div style="padding: 5px; text-align: center; font-weight: bold; color: var(--basic-txt-color);">Basic</div>
              <div style="padding: 5px; text-align: center; font-weight: bold; color: var(--basic-txt-color);">Pro</div>
              <div style="padding: 5px; color: var(--basic-txt-color);">Feature</div>
              <div style="padding: 5px; text-align: center;"><i class="fas fa-check" style="color: green;"></i></div>
              <div style="padding: 5px; text-align: center;"><i class="fas fa-check" style="color: green;"></i></div>
              <div style="padding: 5px; color: var(--basic-txt-color);">Feature</div>
              <div style="padding: 5px; text-align: center;"><i class="fas fa-close" style="color: gray;"></i></div>
              <div style="padding: 5px; text-align: center;"><i class="fas fa-check" style="color: green;"></i></div>
            </div>
          </div>
          
          <div class="ui-button-container">
            <div class="ui-button">
              <div role="button" class="ui-button" style="background-color: transparent; color: var(--color-primary); border: 2px solid var(--color-primary);">
                SHOP NOW
              </div>
            </div>
          </div>
            
            </div>
            </div>
          </div>



          <div class="template-card" data-template="mediaGallery">
            <h3>Media</h3>
            <p>Image and Video Gallery</p>
            <div class="template-preview">
            <div class="tp-scale">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px;">
              <i class="fas fa-arrow-left" style="font-size: 18px;"></i>
              <div style="width: 100%; display: flex; justify-content: center;">
                <span style="font-size: 18px; font-weight: bold; color: var(--basic-txt-color);">Gallery</span>
              </div>
              <i class="fas fa-bars" style="font-size: 18px; color: var(--basic-txt-color);"></i>
            </div>
            
            <h1 style="font-size: 22px; margin: 0 0 5px 0;">Media Gallery</h1>
            
            <div class="fw" style="margin-bottom: 8px;">
              <div class="search-squared">
                <i class="fas fa-search search-squared-icon"></i>
                <div class="search-squared-input empty" data-placeholder="Search media..." style="height: 30px;"></div>
              </div>
            </div>
            
            <div class="image-gallery-wrapper" style="width: 100%; position: relative; margin-bottom: 10px;">
              <div class="image-gallery-con">
                <div class="ig-left-column-con" style="display: grid; grid-template-rows: 1fr 1fr; gap: 5px;">
                  <div class="ig-image-wrapper">
                    <div class="card-image resizeable ig-img-box" style="background-color: var(--neutral-gray); width: 100%; height: 110px; display: flex; justify-content: center; align-items: center;">
                      <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                    </div>
                  </div>
                  <div class="ig-image-wrapper">
                    <div class="card-image resizeable ig-img-box" style="background-color: var(--neutral-gray); width: 100%; height: 110px; display: flex; justify-content: center; align-items: center;">
                      <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                    </div>
                  </div>
                </div>
                <div class="ig-right-column-con" style="display: grid; grid-template-rows: 1fr 1fr; gap: 5px;">
                  <div class="ig-image-wrapper">
                    <div class="card-image resizeable ig-img-box" style="background-color: var(--neutral-gray); width: 100%; height: 110px; display: flex; justify-content: center; align-items: center;">
                      <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                    </div>
                  </div>
                  <div class="ig-image-wrapper">
                    <div class="card-image resizeable ig-img-box" style="background-color: var(--neutral-gray); width: 100%; height: 110px; display: flex; justify-content: center; align-items: center;">
                      <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <br>
            
            <div class="img-gallery-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-bottom: 10px;">
              <div class="card-image img-gallery-grid-item" style="background-color: var(--neutral-gray); width: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center;">
                <i class="fa fa-image img-gallery-ph"></i>
              </div>
              <div class="card-image img-gallery-grid-item" style="background-color: var(--neutral-gray); width: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center;">
                <i class="fa fa-image img-gallery-ph"></i>
              </div>
              <div class="card-image img-gallery-grid-item" style="background-color: var(--neutral-gray); width: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center;">
                <i class="fa fa-image img-gallery-ph"></i>
              </div>
              <div class="card-image img-gallery-grid-item" style="background-color: var(--neutral-gray); width: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center;">
              <i class="fa fa-image img-gallery-ph"></i>
              </div>
              <div class="card-image img-gallery-grid-item" style="background-color: var(--neutral-gray); width: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center;">
                <i class="fa fa-image img-gallery-ph"></i>
              </div>
              <div class="card-image img-gallery-grid-item" style="background-color: var(--neutral-gray); width: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center;">
                <i class="fa fa-image img-gallery-ph"></i>
              </div>
            </div>
            
            <div class="video-container" style="margin-bottom: 10px;">
              <div class="card-image resizeable video-thumbnail" style="background-color: var(--neutral-gray); height: 140px; display: flex; justify-content: center; align-items: center;">
                <i class="fa-solid fa-image image-ph"></i>
              </div>
              <div class="video-play-button">
                <div class="icon-container">
                  <i class="fas fa-play video-play-icon" style="font-size: 24px;"></i>
                </div>
              </div>
              <div class="video-title">Video Title</div>
              <div class="video-duration">3:45</div>
            </div>
            
            <div class="chip-group-container" style="display: flex; gap: 8px; margin-bottom: 10px;">
              <div class="chip" style="background-color: var(--color-primary);">
                <span class="chip-text" style="color: white; font-size: 12px;">Recent</span>
              </div>
              <div class="chip" style="background-color: var(--neutral-gray);">
                <span class="chip-text" style="font-size: 12px;">Photos</span>
              </div>
              <div class="chip" style="background-color: var(--neutral-gray);">
                <span class="chip-text" style="font-size: 12px;">Videos</span>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-around; padding: 5px 0; border-top: 1px solid var(--neutral-gray); color: var(--basic-txt-color); font-size: 8px;">
              <div style="text-align: center;">
                <i class="fas fa-home" style="color: gray; font-size: 16px;"></i>
                <div style="font-size: 11px;">Home</div>
              </div>
              <div style="text-align: center;">
                <i class="fas fa-image" style="color: var(--color-primary); font-size: 16px;"></i>
                <div style="font-size: 11px;">Gallery</div>
              </div>
              <div style="text-align: center;">
                <i class="fas fa-plus" style="color: gray; font-size: 16px;"></i>
                <div style="font-size: 11px;">Add</div>
              </div>
              <div style="text-align: center;">
                <i class="fas fa-heart" style="color: gray; font-size: 16px;"></i>
                <div style="font-size: 11px;">Favorites</div>
              </div>
            </div>

          </div>
            </div>
          </div>



          <div class="template-card" data-template="login">
            <h3>Login</h3>
            <p>Sign in and sign up</p>
            <div class="template-preview">
            <div class="tp-scale">
            <div class="tabs-wrapper" style="display: flex; width: 100%; border-bottom: 1px solid var(--neutral-gray); margin-bottom: 15px;">
              <div class="ui-tab selected" style="background-color: var(--color-primary); color: white; padding: 8px 15px; border-radius: 4px 4px 0 0; flex: 1; text-align: center;">
                Sign In
              </div>
              <div class="ui-tab" style="background-color: var(--neutral-gray); color: var(--basic-txt-color); padding: 8px 15px; border-radius: 4px 4px 0 0; flex: 1; text-align: center;">
                Sign Up
              </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 15px;">
              <div class="ui-image-circle-con" style="margin: 0 auto; width: 60px; height: 60px;">
                <div class="ui-image-circle-wrapper">
                  <div class="card-image ui-image-circle" style="background-color: var(--color-primary); display: flex; justify-content: center; align-items: center;">
                    <i class="fa-solid fa-user" style="color: white; font-size: 24px;"></i>
                  </div>
                </div>
              </div>
              
              <h1 style="font-size: 22px; margin: 10px 0 0 0;">Welcome Back</h1>
              <p style="font-size: 14px; margin: 5px 0 0 0; color: #666;">Sign in to your account</p>
            </div>
            
            <div class="ui-input-wrapper" style="margin-bottom: 12px;">
              <div class="ui-input-label">Email</div>
              <div spellcheck="false" class="ui-input-base empty" data-placeholder="example@email.com" style="border-bottom: 2px solid var(--color-primary);">
              </div>
            </div>
            
            <div class="adjustableSpace" style="height: 10px;"></div>
            
            <div class="ui-input-wrapper" style="margin-bottom: 12px;">
              <div class="ui-input-label">Password</div>
              <div class="ui-input-password-wrapper">
                <div contenteditable="true" spellcheck="false" class="ui-input-base empty password-input" data-placeholder="••••••••" style="border-bottom: 2px solid var(--color-secondary);">
                </div>
                <div class="icon-container ui-input-password-icon">
                  <i class="fas fa-eye"></i>
                </div>
              </div>
            </div>
            
            <div class="custom-checkbox-wrapper" style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
              <div class="fa-regular fa-square checkbox-square-icon" style="position: relative;">
                <i class="fa-solid fa-square-check checkbox-check-icon" style="color: var(--color-primary); display: none;"></i>
              </div>
              <span style="font-size: 14px;">Remember me</span>
            </div>
            
            <div class="adjustableSpace" style="height: 10px;"></div>
            
            <div class="ui-button-container" style="margin-bottom: 15px;">
              <div class="ui-button">
                <div role="button" class="ui-button" style="background-color: var(--color-primary); color: white;">
                  SIGN IN
                </div>
              </div>
            </div>
            
            <div class="adjustableSpace" style="height: 10px;"></div>
            
            <p style="text-align: center; font-size: 14px; margin: 0;">Don't have an account? <span style="color: var(--color-primary);">Sign up</span></p>
          </div>
            </div>
          </div>



          <div class="template-card" data-template="onboarding">
          <h3>Onboarding</h3>
          <p>Instrctions for new users</p>
          <div class="template-preview">
          <div class="tp-scale">
          <div class="fw">
            <div class="card-image ui-image resizeable" style="background-color: var(--neutral-gray); height: 80px; display: flex; justify-content: center; align-items: center; margin-top: 10px;">
              <i class="fa-solid fa-image image-ph"></i>    
            </div>
          </div>
          
          <h1 style="font-size: 22px; text-align: center; margin: 10px 0 5px 0;">Welcome to the App</h1>
          <p style="font-size: 14px; text-align: center; margin: 0 0 15px 0; color: #666;">Discover amazing features that will help you accomplish your goals.</p>
          
          <div class="adjustableSpace" style="height: 15px;"></div>
          
          <div class="progress-tracker-container">
            <div class="steps-container" style="display: flex; align-items: center; position: relative; justify-content: center;">
              <div class="step-container" data-step="" style="display: flex; flex-direction: column; align-items: center; z-index: 2; margin: 0 4px;">
                <div class="step-circle" style="width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; background-color: var(--color-primary); color: white;">
                  1
                </div>
                <div class="pt-step-label" style="font-size: 12px; margin-top: 5px;">Step 1</div>
              </div>
              <div style="height: 2px; background-color: #E0E0E0; flex: 1; margin: 15px 0 0 0;"></div>
              <div class="step-container" data-step="" style="display: flex; flex-direction: column; align-items: center; z-index: 2; margin: 0 4px;">
                <div class="step-circle" style="width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; background-color: var(--neutral-gray); color: #666;">
                  2
                </div>
                <div class="pt-step-label" style="font-size: 12px; margin-top: 5px;">Step 2</div>
              </div>
              <div style="height: 2px; background-color: #E0E0E0; flex: 1; margin: 15px 0 0 0;"></div>
              <div class="step-container" data-step="" style="display: flex; flex-direction: column; align-items: center; z-index: 2; margin: 0 4px;">
                <div class="step-circle" style="width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; background-color: var(--neutral-gray); color: #666;">
                  3
                </div>
                <div class="pt-step-label" style="font-size: 12px; margin-top: 5px;">Step 3</div>
              </div>
            </div>
          </div>
          
          <div class="adjustableSpace" style="height: 15px;"></div>
          
          <div class="ui-button-container" style="margin-bottom: 15px;">
            <div class="ui-button" style="height: 20px;">
              <div role="button" class="ui-button" style="background-color: var(--color-primary); color: white;">
                NEXT
              </div>
            </div>
          </div>
          
          <div class="adjustableSpace" style="height: 5px;"></div>
          
          <p style="text-align: center; font-size: 14px; margin: 0; color: #666;">Skip intro</p>

        </div>
          </div>
        </div>



        <div class="template-card" data-template="settings">
          <h3>Settings</h3>
          <p>Toggle settings</p>
          <div class="template-preview">
          <div class="tp-scale">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px;">
            <div class="icon-container">
              <i class="fas fa-arrow-left" style="font-size: 18px;"></i>
            </div>
            <div style="width: 100%; display: flex; justify-content: center;">
              <span style="font-size: 18px; font-weight: bold; color: var(--basic-txt-color);">Settings</span>
            </div>
        </div>
          
          <div class="fw">
            <div class="align-content avatar-inner">
              <div class="avatar-base" style="background-color: var(--color-primary); padding: 4px; border-radius: 50%;">
                <span>JD</span>
              </div>
              <div class="avatar-column">
                <span class="avatar-text">John Doe</span>
                <span class="avatar-sub-txt">john.doe@example.com</span>
              </div>
            </div>
          </div>
          
          <div class="adjustableSpace" style="height: 15px;"></div>
          
          <h3 style="margin: 0 0 5px 0;">App Preferences</h3>
          <div style="width: 100%; border-top: 1px solid var(--neutral-gray); margin-bottom: 10px;"></div>
          
          <div class="li-base li-padding-x" style="background-color: var(--input-bg-color); margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
            <div class="li-content" style="padding-left: 12px; padding-right: 8px;">
              <span>Notifications</span>
              <span class="li-subtitle">Get updates about new features</span>
            </div>
          </div>
          <div class="range-slider-container" style="width: 44px; margin-bottom: 8px;">
          <div style="width: 40px; height: 20px; background-color: var(--color-primary); border-radius: 14px; position: relative; padding: 2px 0;">
            <div style="width: 18px; height: 18px; background-color: white; border-radius: 50%; position: absolute; right: 2px; top: 3px;"></div>
          </div>
        </div>
          
          <div class="li-base li-padding-x" style="background-color: var(--input-bg-color); margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
            <div class="li-content" style="padding-left: 12px; padding-right: 8px;">
              <span>Dark Mode</span>
              <span class="li-subtitle">Switch to dark mode interface</span>
            </div>
          </div>
          <div class="range-slider-container" style="width: 44px; margin-bottom: 8px;">
          <div style="width: 40px; height: 20px; background-color: var(--neutral-gray); border-radius: 14px; position: relative; padding: 2px 0;">
            <div style="width: 18px; height: 18px; background-color: white; border-radius: 50%; position: absolute; left: 2px; top: 3px;"></div>
          </div>
        </div>
          
          <div class="adjustableSpace" style="height: 15px;"></div>
          
          <h3 style="margin: 0 0 5px 0;">Account Settings</h3>
          <div style="width: 100%; border-top: 1px solid var(--neutral-gray); margin-bottom: 10px;"></div>
          
          <div class="li-base li-padding-x li-space-between" style="background-color: var(--input-bg-color); margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 12px; padding-left: 8px;">
              <div class="icon-container">
                <i class="fas fa-user" style="color: var(--color-primary);"></i>
              </div>
              <span>Profile Information</span>
            </div>
            <div class="icon-container li-chevron">
              <i class="fas fa-chevron-right" style="color: var(--color-primary);"></i>
            </div>
          </div>
          
          <div class="li-base li-padding-x li-space-between" style="background-color: var(--input-bg-color); margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 12px; padding-left: 8px;">
              <div class="icon-container">
                <i class="fas fa-lock" style="color: var(--color-primary);"></i>
              </div>
              <span>Privacy & Security</span>
            </div>
            <div class="icon-container li-chevron">
              <i class="fas fa-chevron-right" style="color: var(--color-primary);"></i>
            </div>
          </div>
          
          <div class="li-base li-padding-x li-space-between" style="background-color: var(--input-bg-color); margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 12px; padding-left: 8px;">
              <div class="icon-container">
                <i class="fas fa-headset" style="color: var(--color-primary);"></i>
              </div>
              <span>Help & Support</span>
            </div>
            <div class="icon-container li-chevron">
              <i class="fas fa-chevron-right" style="color: var(--color-primary);"></i>
            </div>
          </div>
        </div>
        </div>
        </div>



        <div class="template-card" data-template="messaging">
          <h3>Messaging</h3>
          <p>Chat with friends</p>
          <div class="template-preview">
          <div class="tp-scale">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px;">
            <div class="icon-container">
              <i class="fas fa-arrow-left" style="font-size: 18px;"></i>
            </div>
            &emsp;
            <div style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;">
              <div style="width: 22px; height: 22px; background-color: var(--neutral-gray); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                <i class="fas fa-user" style="font-size: 12px;"></i>
              </div>
              <div style="text-align: left;">
                <div style="font-size: 14px; font-weight: bold; color: var(--basic-txt-color);">J Smith</div>
                <div style="font-size: 10px; color: #27ae60;">Online</div>
              </div>
              <div style="margin-left: auto; display: flex; gap: 16px; color: var(--basic-txt-color);">
                <i class="fas fa-phone" style="font-size: 14px;"></i>
                <i class="fas fa-video" style="font-size: 14px;"></i>
              </div>
            </div>
          </div>
          
          <!-- Left chat bubble - received message -->
          <div class="chat-container" style="display: flex; margin-bottom: 12px; align-items: flex-end; flex-direction: row">
            <div style="width: 32px; height: 32px; background-color: var(--color-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-right: 8px; color: white; font-weight: bold;">
              JS
            </div>
            <div style="max-width: 70%;">
              <div style="background-color: var(--input-bg-color); padding: 10px 12px; border-radius: 18px 18px 18px 0; margin-bottom: 4px; color: var(--basic-txt-color); font-size: 14px;">
                <div>Hi there! How are you doing today?</div>
              </div>
              <div style="font-size: 10px; color: #666;">10:03 AM</div>
            </div>
          </div>
          
          <!-- Right chat bubble - sent message -->
          <div class="chat-container" style="display: flex; margin-bottom: 12px; align-items: flex-end;">
            <div style="width: 32px; height: 32px; background-color: var(--color-accent); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: 8px; color: white; font-weight: bold;">
              ME
            </div>
            <div style="max-width: 70%;">
              <div style="background-color: var(--color-primary); padding: 10px 12px; border-radius: 18px 18px 0 18px; margin-bottom: 4px; color: white; font-size: 14px;">
                <div>Hey! I'm good, thanks for asking. How about you?</div>
              </div>
              <div style="font-size: 10px; color: #666; text-align: right;">10:05 AM</div>
            </div>
          </div>
          
          <!-- Left chat bubble - received message -->
          <div class="chat-container" style="display: flex; margin-bottom: 12px; align-items: flex-end; flex-direction: row">
            <div style="width: 32px; height: 32px; background-color: var(--color-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-right: 8px; color: white; font-weight: bold;">
              JS
            </div>
            <div style="max-width: 70%;">
              <div style="background-color: var(--input-bg-color); padding: 10px 12px; border-radius: 18px 18px 18px 0; margin-bottom: 4px; color: var(--basic-txt-color); font-size: 14px;">
                <div>I'm great! Do you want to meet up this weekend?</div>
              </div>
              <div style="font-size: 10px; color: #666;">10:08 AM</div>
            </div>
          </div>
          
          <!-- Right chat bubble - sent message -->
          <div class="chat-container" style="display: flex; flex-direction: row-reverse; margin-bottom: 12px; align-items: flex-end;">
            <div style="width: 32px; height: 32px; background-color: var(--color-accent); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: 8px; color: white; font-weight: bold;">
              ME
            </div>
            <div style="max-width: 70%;">
              <div style="background-color: var(--color-primary); padding: 10px 12px; border-radius: 18px 18px 0 18px; margin-bottom: 4px; color: white; font-size: 14px;">
                <div>Absolutely! I was thinking we could check out that new restaurant downtown.</div>
              </div>
              <div style="font-size: 10px; color: #666; text-align: right;">10:10 AM</div>
            </div>
          </div>
          
          <div style="position: relative; bottom: 10px; left: 0; right: 0; display: flex; padding: 0px; background-color: var(--color-background);">
            <div class="chat-input-con" style="width:100%; display: flex; justify-content: space-between;">
              <button class="chat-icon-btn icon-container" style="background: none; border: none;">
                <i class="far fa-smile"></i>
              </button>
              Your message...
              <button class="chat-send-btn icon-container" style="background-color: var(--color-primary); border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: white;">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
          </div>
        </div>



        <div class="template-card" data-template="restaurant">
            <h3>Restaurant</h3>
            <p>Menu, reviews, and payments</p>
            <div class="template-preview">
            <div class="tp-scale">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px;">
              <div style="font-size: 18px; font-weight: bold; color: var(--color-primary);">
                Delicious
              </div>
              <div style="display: flex; gap: 15px; align-items: center; color: var(--basic-txt-color);">
                <i class="fas fa-search" style="font-size: 16px;"></i>
                <i class="fas fa-bars" style="font-size: 16px;"></i>
              </div>
            </div>
            
            <div class="hero hero-base" style="height: 100px; margin-bottom: 12px; position: relative; display: flex; align-items: flex-end;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--neutral-gray);">
                <i class="fa-solid fa-image" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; color: var(--placeholder-color);"></i>
              </div>
              <div class="hero-gradient" style="background: linear-gradient(transparent 28%, rgba(0,0,0,0.7) 78%); position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></div>
              <div class="hero-content" style="padding: 10px; position: relative; z-index: 2; width: 100%;">
                <h2 style="color: white; margin: 0;">Delicious Restaurant</h2>
              </div>
            </div>
            
            <div class="chip-group-container" style="display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto; padding: 0 2px;">
              <div class="chip" style="background-color: var(--color-primary); border-radius: 16px; padding: 4px 12px; white-space: nowrap;">
                <span style="color: white; font-size: 12px;">Appetizers</span>
              </div>
              <div class="chip" style="background-color: var(--neutral-gray); border-radius: 16px; padding: 4px 12px; white-space: nowrap;">
                <span style="font-size: 12px;">Main Course</span>
              </div>
              <div class="chip" style="background-color: var(--neutral-gray); border-radius: 16px; padding: 4px 12px; white-space: nowrap;">
                <span style="font-size: 12px;">Desserts</span>
              </div>
            </div>
            
            <h2 style="font-size: 18px; margin: 12px 0 8px;">Popular Dishes</h2>
            
            <div class="card-con card-hz" style="margin-bottom: 8px; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden;">
              <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 80px; height: auto; display: flex; justify-content: center; align-items: center;">
                <i class="fa-solid fa-image"></i>
              </div>
              <div class="card-hz-content" style="padding: 8px;">
                <h3 class="card-title" style="font-size: 16px; margin: 0 0 4px;">Pasta Carbonara</h3>
                <p class="card-text" style="font-size: 12px; margin: 0; color: #666;">Classic Italian pasta</p>
                
              </div>
            </div>
            
            <div class="card-con card-hz" style="margin-bottom: 8px; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden;">
              <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 80px; height: auto; display: flex; justify-content: center; align-items: center;">
                <i class="fa-solid fa-image"></i>
              </div>
              <div class="card-hz-content" style="padding: 8px;">
                <h3 class="card-title" style="font-size: 16px; margin: 0 0 4px;">Grilled Salmon</h3>
                <p class="card-text" style="font-size: 12px; margin: 0; color: #666;">Fresh salmon fillet</p>
                
              </div>
            </div>
            
            <h2 style="font-size: 18px; margin: 12px 0 8px;">Chef's Specials</h2>
            
            <div class="card-con card-hz" style="margin-bottom: 12px; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden;">
              <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 80px; height: auto; display: flex; justify-content: center; align-items: center;">
                <i class="fa-solid fa-image"></i>
              </div>
              <div class="card-hz-content" style="padding: 8px;">
                <h3 class="card-title" style="font-size: 16px; margin: 0 0 4px;">Chocolate Cake</h3>
                <p class="card-text" style="font-size: 12px; margin: 0; color: #666;">Chocolate cake with vanilla ice cream</p>
              </div>
            </div>
            
            <div class="ui-button-container" style="margin-bottom: 14px; height: 20px;">
                <div role="button" class="ui-button" style="background-color: var(--color-primary); color: white; text-align: center; padding: 8px 0; border-radius: 8px; font-weight: bold; height: 20px;">
                  VIEW FULL MENU
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-around; padding: 10px; background-color: var(--color-background); border-top: 1px solid var(--neutral-gray); color: var(--basic-txt-color);">
              <div style="text-align: center;">
                <i class="fas fa-utensils" style="color: var(--color-primary); font-size: 20px;"></i>
                <div style="font-size: 12px; margin-top: 4px;">Menu</div>
              </div>
              <div style="text-align: center;">
                <i class="fas fa-search" style="color: #666; font-size: 20px;"></i>
                <div style="font-size: 12px; margin-top: 4px;">Search</div>
              </div>
              <div style="text-align: center;">
                <i class="fas fa-shopping-bag" style="color: #666; font-size: 20px;"></i>
                <div style="font-size: 12px; margin-top: 4px;">Orders</div>
              </div>
              <div style="text-align: center;">
                <i class="fas fa-user" style="color: #666; font-size: 20px;"></i>
                <div style="font-size: 12px; margin-top: 4px;">Profile</div>
              </div>
            </div>
          </div>
            </div>
      </div>



      <div class="template-card" data-template="blog">
        <h3>Blog</h3>
        <p>Articles, comments, and social media</p>
        <div class="template-preview">
        <div class="tp-scale">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px;">
          <span style="font-size: 20px; font-weight: bold; color: var(--color-primary);">Blog</span>
          <div>
            <i class="fas fa-bars" style="font-size: 20px; color: var(--basic-txt-color);"></i>
          </div>
        </div>
        
        <div class="fw" style="margin-bottom: 12px;">
          <div class="card-image ui-image-full" style="height: 100px; background-color: var(--neutral-gray); display: flex; justify-content: center; align-items: center;">
            <i class="fa-solid fa-image" style="font-size: 24px; color: var(--placeholder-color);"></i>
          </div>
        </div>
        
        <h1 style="font-size: 20px; margin: 0 0 8px;">The Art of Creating User Interfaces</h1>
        
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 40px; height: 40px; background-color: var(--neutral-gray); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
            <i class="fas fa-user" style="color: var(--placeholder-color);"></i>
          </div>
          <div>
            <div style="font-weight: bold; color: var(--basic-txt-color);">Jane Designer</div>
            <div style="font-size: 12px; color: #666;">March 15, 2025 • 5 min read</div>
          </div>
        </div>
        
        <p style="font-size: 14px; line-height: 1.5; margin-bottom: 12px;">User interface design is at the heart of every digital product. It's what users see, interact with, and ultimately judge your product by.</p>
        
        <p style="font-size: 14px; line-height: 1.5; margin-bottom: 12px;">In today's digital landscape, a well-designed user interface can make the difference between a product that succeeds and one that fails.</p>
        
        <h2 style="font-size: 18px; margin: 16px 0 8px;">Design Principles to Remember</h2>
        
        <p style="font-size: 14px; line-height: 1.5; margin-bottom: 12px;">Applying these principles consistently can elevate your designs from good to great. Each element should have a purpose.</p>
        
        <div style="margin-left: 20px; margin-bottom: 12px; color: var(--basic-txt-color);">
          <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
            <i class="fas fa-circle" style="font-size: 8px; margin-top: 6px; margin-right: 8px; color: var(--color-primary);"></i>
            <div>Consistency across the interface</div>
          </div>
          <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
            <i class="fas fa-circle" style="font-size: 8px; margin-top: 6px; margin-right: 8px; color: var(--color-primary);"></i>
            <div>Clear visual hierarchy and focus</div>
          </div>
          <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
            <i class="fas fa-circle" style="font-size: 8px; margin-top: 6px; margin-right: 8px; color: var(--color-primary);"></i>
            <div>User-centered design approach</div>
          </div>
        </div>
        
        <div style="border-left: 4px solid var(--color-primary); padding: 8px 12px; background-color: var(--input-bg-color); margin-bottom: 12px; font-style: italic; color: var(--basic-txt-color);">
          "Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs
        </div>
        
        <p style="font-size: 14px; line-height: 1.5; margin-bottom: 12px;">Remember that great UI design is iterative. Gather feedback, test with real users, and continuously refine your interfaces.</p>
        
        <div style="width: 100%; border-top: 1px solid var(--neutral-gray); margin: 16px 0;"></div>
        
        <div class="chip-group-container" style="display: flex; gap: 8px; margin-bottom: 12px;">
          <div class="chip" style="background-color: var(--color-primary); border-radius: 16px; padding: 4px 12px;">
            <span style="color: white; font-size: 12px;">Design</span>
          </div>
          <div class="chip" style="background-color: var(--color-primary); border-radius: 16px; padding: 4px 12px;">
            <span style="color: white; font-size: 12px;">UI/UX</span>
          </div>
          <div class="chip" style="background-color: var(--color-primary); border-radius: 16px; padding: 4px 12px;">
            <span style="color: white; font-size: 12px;">Tips</span>
          </div>
        </div>
        
        <p style="font-size: 14px; line-height: 1.5; margin-bottom: 12px;">Share this article with fellow designers and developers!</p>
        
        <div class="image-gallery-wrapper" style="margin-bottom: 16px;">
          <div class="img-gallery-strip" style="display: flex; gap: 8px; overflow-x: auto; padding: 0px;">
            <div class="card-image" style="background-color: var(--neutral-gray); min-width: 70px; height: 70px; border-radius: 4px; display: flex; justify-content: center; align-items: center;">
              <i class="fa fa-image" style="color: var(--placeholder-color);"></i>
            </div>
            <div class="card-image" style="background-color: var(--neutral-gray); min-width: 70px; height: 70px; border-radius: 4px; display: flex; justify-content: center; align-items: center;">
              <i class="fa fa-image" style="color: var(--placeholder-color);"></i>
            </div>
            <div class="card-image" style="background-color: var(--neutral-gray); min-width: 70px; height: 70px; border-radius: 4px; display: flex; justify-content: center; align-items: center;">
              <i class="fa fa-image" style="color: var(--placeholder-color);"></i>
            </div>
          </div>
        </div>
        
        <footer style="background-color: var(--color-primary); color: white; padding: 12px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <div>
              <h4 style="margin: 0 0 8px 0;">Blog</h4>
              <div style="font-size: 12px;">Great articles for designers</div>
            </div>
            <div style="display: flex; flex-direction: column; font-size: 12px;">
              <a href="#" style="color: white; margin-bottom: 4px;">Home</a>
              <a href="#" style="color: white; margin-bottom: 4px;">Articles</a>
              <a href="#" style="color: white;">About</a>
            </div>
          </div>
          <div style="font-size: 12px; opacity: 0.8; text-align: center; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px;">
            © 2025 Design Blog. All rights reserved.
          </div>
        </footer>
      </div>
      
        </div>
    </div>



    <div class="template-card" data-template="education">
        <h3>Education</h3>
        <p>Learn new topics</p>
        <div class="template-preview">
        <div class="tp-scale">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px;">
          <span style="font-size: 20px; font-weight: bold; color: var(--color-primary);">LearnCode</span>
          <div style="display: flex; gap: 16px;">
            <i class="fas fa-search" style="font-size: 18px;"></i>
            <i class="fas fa-bell" style="font-size: 18px;"></i>
            <i class="fas fa-bars" style="font-size: 18px;"></i>
          </div>
        </div>
        
        <div class="hero hero-base" style="height: 100px; margin-bottom: 12px; position: relative; display: flex; align-items: flex-end;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
            <i class="fas fa-image" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; color: var(--placeholder-color);"></i>
          </div>
          <div class="hero-gradient" style="background: linear-gradient(transparent 28%, rgba(0,0,0,0.7) 78%); position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></div>
          <div class="hero-content" style="padding: 40px 0 0 0; position: relative; z-index: 2; width: 100%;">
            <h2 style="color: white; margin: 0;">JavaScript Basics</h2>
          </div>
        </div>
        
        <p style="font-size: 14px; line-height:, 1.5; margin-bottom: 12px;">Master the basics of JavaScript programming with this comprehensive course. Learn syntax, functions, objects, and more.</p>
        
        <div class="progress-group" style="margin-bottom: 16px;">
          <div class="progress-bar" style="width: 100%; height: 6px; background-color: var(--neutral-gray); border-radius: 5px; overflow: hidden;">
            <div style="width: 25%; height: 100%; background-color: var(--color-primary); transition: width 0.3s ease;"></div>
          </div>
          <div style="color: var(--basic-txt-color); font-size: 12px; margin-top: 4px; text-align: right;">25% complete</div>
        </div>
        
        <h2 style="font-size: 18px; margin: 16px 0 8px;">Module 1: Getting Started</h2>
        
        <div class="accordion-container" style="margin-bottom: 12px; border: 1px solid var(--color-primary); border-radius: 8px; overflow: hidden;">
          <div class="accordion-header" style="background-color: var(--color-primary); padding: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: white;">Week 1: JavaScript Basics</span>
            <i class="fas fa-chevron-down" style="color: white;"></i>
          </div>
        </div>
        
        <div class="li-base li-padding-x li-space-between" style="background-color: var(--input-bg-color); margin-bottom: 8px; border-left: 4px solid var(--color-primary);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="icon-container">
              <i class="fas fa-play-circle" style="color: var(--color-primary);"></i>
            </div>
            <span>Lesson 1: Introduction to JavaScript</span>
          </div>
          <div class="icon-container">
            <i class="fas fa-check-circle" style="color: green;"></i>
          </div>
        </div>
        
        <div class="li-base li-padding-x li-space-between" style="background-color: var(--input-bg-color); margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="icon-container">
              <i class="fas fa-play-circle" style="color: var(--color-primary);"></i>
            </div>
            <span>Lesson 2: Variables and Data Types</span>
          </div>
          <div class="icon-container">
            <i class="fas fa-lock" style="color: #999;"></i>
          </div>
        </div>
        
        <div class="accordion-container" style="margin-bottom: 12px; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden;">
          <div class="accordion-header" style="background-color: var(--neutral-gray); padding: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>Week 2: Functions & Objects</span>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
        
        <h2 style="font-size: 18px; margin: 16px 0 8px;">Additional Resources</h2>
        
        <div class="card-con card-hz" style="margin-bottom: 12px; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden;">
          <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 60px; height: auto; display: flex; justify-content: center; align-items: center;">
            <i class="fas fa-file-code" style="color: var(--color-primary); font-size: 24px;"></i>
          </div>
          <div class="card-hz-content" style="padding: 8px;">
            <h3 class="card-title" style="font-size: 16px; margin: 0 0 4px;">JavaScript</h3>
            <p class="card-text" style="font-size: 12px; margin: 0; color: #666;">Documentation and reference guides</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-around; padding: 10px; background-color: var(--color-background); border-top: 1px solid var(--neutral-gray); color: var(--basic-txt-color);">
          <div style="text-align: center;">
            <i class="fas fa-book" style="color: var(--color-primary); font-size: 20px;"></i>
            <div style="font-size: 12px; margin-top: 4px;">Courses</div>
          </div>
          <div style="text-align: center;">
            <i class="fas fa-search" style="color: #666; font-size: 20px;"></i>
            <div style="font-size: 12px; margin-top: 4px;">Search</div>
          </div>
          <div style="text-align: center;">
            <i class="fas fa-sticky-note" style="color: #666; font-size: 20px;"></i>
      <div style="font-size: 12px; margin-top: 4px;">Notes</div>
    </div>
    <div style="text-align: center;">
      <i class="fas fa-user" style="color: #666; font-size: 20px;"></i>
      <div style="font-size: 12px; margin-top: 4px;">Profile</div>
    </div>
  </div>
</div>
        </div>
    </div>



    <div class="template-card" data-template="mapLocation">
        <h3>Map/Location</h3>
        <p>Location-based services</p>
        <div class="template-preview">
        <div class="tp-scale">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px; color: var(--basic-txt-color);">
          <div class="icon-container">
            <i class="fas fa-arrow-left" style="font-size: 18px;"></i>
          </div>
          <div style="width: 100%; display: flex; justify-content: center;">
            <span style="font-size: 18px; font-weight: bold; color: var(--basic-txt-color);">Explore Nearby</span>
          </div>
          <div class="icon-container">
            <i class="fas fa-sliders-h" style="font-size: 18px;"></i>
          </div>
        </div>
        
        <div class="fw" style="margin-bottom: 10px;">
          <div class="search-container" style="height: 36px;">
            <i class="fas fa-search search-icon"></i>
            <div class="search-input empty" data-placeholder="Search locations..." style="color: #999;"></div>
          </div>
        </div>
        
        <div class="colorBlock-inner" style="height: 180px; background-color: #e3e9f3; position: relative; margin-bottom: 10px; border-radius: 8px;">
          <!-- Map pin icon -->
          <div class="icon-container" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <i class="fas fa-map-marker-alt" style="font-size: 32px; color: var(--color-primary);"></i>
          </div>
          
          <!-- Map controls -->
          <div style="position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 5px;">
            <button style="width: 30px; height: 30px; border-radius: 4px; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border: none;">
              <i class="fas fa-plus" style="font-size: 12px;"></i>
            </button>
            <button style="width: 30px; height: 30px; border-radius: 4px; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border: none;">
              <i class="fas fa-minus" style="font-size: 12px;"></i>
            </button>
          </div>
          
          <!-- Current location indicator -->
          <div style="position: absolute; bottom: 10px; left: 10px; background: white; border-radius: 16px; padding: 6px 12px; font-size: 12px; display: flex; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <i class="fas fa-location-arrow" style="color: var(--color-primary); margin-right: 6px;"></i>
            <span>Current Location</span>
          </div>
        </div>
        
        <div class="chip-group-container" style="display: flex; gap: 8px; margin-bottom: 10px; overflow-x: auto; padding: 0 2px;">
          <div class="chip" style="background-color: var(--color-primary); border-radius: 16px; padding: 4px 12px; white-space: nowrap;">
            <span style="color: white; font-size: 12px;">Restaurants</span>
          </div>
          <div class="chip" style="background-color: var(--neutral-gray); border-radius: 16px; padding: 4px 12px; white-space: nowrap;">
            <span style="font-size: 12px;">Hotels</span>
          </div>
          <div class="chip" style="background-color: var(--neutral-gray); border-radius: 16px; padding: 4px 12px; white-space: nowrap;">
            <span style="font-size: 12px;">Attractions</span>
          </div>
        </div>
        
        <div class="card-con card-hz" style="margin-bottom: 8px; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden;">
          <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 80px; height: auto; display: flex; justify-content: center; align-items: center;">
            <i class="fa-solid fa-utensils"></i>
          </div>
          <div class="card-hz-content" style="padding: 8px;">
            <h3 class="card-title" style="font-size: 16px; margin: 0 0 4px;">Café</h3>
            <p class="card-text" style="font-size: 12px; margin: 0; color: #666;">⭐ 4.5 (238) • 0.3 miles away</p>
            <div style="font-size: 12px; margin-top: 4px;">
            </div>
          </div>
        </div>
        
        <div class="card-con card-hz" style="margin-bottom: 8px; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden;">
          <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 80px; height: auto; display: flex; justify-content: center; align-items: center;">
            <i class="fa-solid fa-landmark"></i>
          </div>
          <div class="card-hz-content" style="padding: 8px;">
            <h3 class="card-title" style="font-size: 16px; margin: 0 0 4px;">City Museum</h3>
            <p class="card-text" style="font-size: 12px; margin: 0; color: #666;">⭐ 4.8 (512) • 0.7 miles away</p>
            <div style="font-size: 12px; margin-top: 4px;">
            </div>
          </div>
        </div>
        
        <div class="card-con card-hz" style="margin-bottom: 12px; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: hidden;">
          <div class="card-image card-hz-img-lft" style="background-color: var(--neutral-gray); width: 80px; height: auto; display: flex; justify-content: center; align-items: center;">
            <i class="fa-solid fa-hotel"></i>
          </div>
          <div class="card-hz-content" style="padding: 8px;">
            <h3 class="card-title" style="font-size: 16px; margin: 0 0 4px;">Riverside Hotel</h3>
            <p class="card-text" style="font-size: 12px; margin: 0; color: #666;">⭐ 4.2 (189) • 1.2 miles away</p>
            <div style="font-size: 12px; margin-top: 4px;">
            </div>
          </div>
        </div>
        
        <div style="position: fixed; bottom: 16px; right: 16px; width: 56px; height: 56px; border-radius: 28px; background-color: var(--color-primary); display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 1001;">
          <i class="fas fa-directions" style="color: white; font-size: 24px;"></i>
        </div>
      </div>
        </div>
    </div>



    <div class="template-card" data-template="calendar">
        <h3>Calendar</h3>
        <p>Schedule appointments</p>
        <div class="template-preview">
        <div class="tp-scale">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; background-color: var(--color-background); margin-bottom: 10px;">
          <span style="font-size: 20px; font-weight: bold; color: var(--color-primary);">Calendar</span>
          <div style="display: flex; gap: 16px; color: var(--basic-txt-color);">
            <i class="fas fa-search" style="font-size: 18px;"></i>
            <i class="fas fa-bars" style="font-size: 18px;"></i>
          </div>
        </div>
        
        <h2 style="font-size: 18px; margin: 12px 0 8px; text-align: center; color: var(--basic-txt-color);">March 2025</h2>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 12px; color: var(--basic-txt-color);">
          <thead>
            <tr>
              <th style="padding: 8px 0; text-align: center; font-weight: bold;">S</th>
              <th style="padding: 8px 0; text-align: center; font-weight: bold;">M</th>
              <th style="padding: 8px 0; text-align: center; font-weight: bold;">T</th>
              <th style="padding: 8px 0; text-align: center; font-weight: bold;">W</th>
              <th style="padding: 8px 0; text-align: center; font-weight: bold;">T</th>
              <th style="padding: 8px 0; text-align: center; font-weight: bold;">F</th>
              <th style="padding: 8px 0; text-align: center; font-weight: bold;">S</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; height: 36px; width: 36px;"></td>
              <td style="text-align: center; height: 36px; width: 36px;"></td>
              <td style="text-align: center; height: 36px; width: 36px;"></td>
              <td style="text-align: center; height: 36px; width: 36px;">1</td>
              <td style="text-align: center; height: 36px; width: 36px;">2</td>
              <td style="text-align: center; height: 36px; width: 36px;">3</td>
              <td style="text-align: center; height: 36px; width: 36px;">4</td>
            </tr>
            <tr>
              <td style="text-align: center; height: 36px; width: 36px;">5
                <div style="width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; margin: 2px auto 0;"></div>
              </td>
              <td style="text-align: center; height: 36px; width: 36px;">6</td>
              <td style="text-align: center; height: 36px; width: 36px;">7</td>
              <td style="text-align: center; height: 36px; width: 36px;">8</td>
              <td style="text-align: center; height: 36px; width: 36px;">9</td>
              <td style="text-align: center; height: 36px; width: 36px;">10
                <div style="width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; margin: 2px auto 0;"></div>
              </td>
              <td style="text-align: center; height: 36px; width: 36px;">11</td>
            </tr>
            <tr>
              <td style="text-align: center; height: 36px; width: 36px;">12</td>
              <td style="text-align: center; height: 36px; width: 36px;">13</td>
              <td style="text-align: center; height: 36px; width: 36px;">14</td>
              <td style="text-align: center; height: 36px; width: 36px;">15
                <div style="width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; margin: 2px auto 0;"></div>
              </td>
              <td style="text-align: center; height: 30px; width: 30px; background-color: var(--color-primary); color: white; border-radius: 50%;">16</td>
              <td style="text-align: center; height: 36px; width: 36px;">17
                <div style="width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; margin: 2px auto 0;"></div>
              </td>
              <td style="text-align: center; height: 36px; width: 36px;">18</td>
            </tr>
            <tr>
              <td style="text-align: center; height: 36px; width: 36px;">19</td>
              <td style="text-align: center; height: 36px; width: 36px;">20</td>
              <td style="text-align: center; height: 36px; width: 36px;">21</td>
              <td style="text-align: center; height: 36px; width: 36px;">22</td>
              <td style="text-align: center; height: 36px; width: 36px;">23
                <div style="width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; margin: 2px auto 0;"></div>
              </td>
              <td style="text-align: center; height: 36px; width: 36px;">24</td>
              <td style="text-align: center; height: 36px; width: 36px;">25</td>
            </tr>
            <tr>
              <td style="text-align: center; height: 36px; width: 36px;">26</td>
              <td style="text-align: center; height: 36px; width: 36px;">27
                <div style="width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; margin: 2px auto 0;"></div>
              </td>
              <td style="text-align: center; height: 36px; width: 36px;">28</td>
              <td style="text-align: center; height: 36px; width: 36px;">29</td>
              <td style="text-align: center; height: 36px; width: 36px;">30</td>
              <td style="text-align: center; height: 36px; width: 36px;">31</td>
              <td style="text-align: center; height: 36px; width: 36px;"></td>
            </tr>
          </tbody>
        </table>
        
        <h3 style="font-size: 16px; margin: 16px 0 4px;">Today • March 16</h3>
        <div style="width: 100%; border-top: 1px solid var(--neutral-gray); margin-bottom: 8px;"></div>
        
        <div class="li-base li-padding-x" style="background-color: var(--input-bg-color); margin-bottom: 8px; border-left: 3px solid var(--color-primary);">
          <div class="icon-container li-icon">
            <i class="fas fa-users" style="color: var(--color-primary);"></i>
          </div>
          <div class="li-content">
            <span>9:00 AM - 10:30 AM • Team Meeting</span>
            <span class="li-subtitle">Conference Room A</span>
          </div>
        </div>
        
        <div class="li-base li-padding-x" style="background-color: var(--input-bg-color); margin-bottom: 8px; border-left: 3px solid var(--color-accent);">
          <div class="icon-container li-icon">
            <i class="fas fa-briefcase" style="color: var(--color-accent);"></i>
          </div>
          <div class="li-content">
            <span>2:30 PM - 4:00 PM • Client Presentation</span>
            <span class="li-subtitle">Meeting Room B</span>
          </div>
        </div>
        
        <div class="li-base li-padding-x" style="background-color: rgba(52, 152, 219, 0.1); margin-bottom: 8px; border-left: 3px solid var(--color-primary);">
          <div class="icon-container li-icon">
            <i class="fas fa-utensils" style="color: var(--color-primary);"></i>
          </div>
          <div class="li-content">
            <span>6:00 PM - 8:30 PM • Dinner with Friends</span>
            <span class="li-subtitle">Downtown Restaurant</span>
          </div>
        </div>
        
        <h3 style="font-size: 16px; margin: 16px 0 4px;">Tomorrow • March 17</h3>
        <div style="width: 100%; border-top: 1px solid var(--neutral-gray); margin-bottom: 8px;"></div>
        
        <div class="li-base li-padding-x" style="background-color: var(--input-bg-color); margin-bottom: 12px; border-left: 3px solid #e74c3c;">
          <div class="icon-container li-icon">
            <i class="fas fa-tooth" style="color: #e74c3c;"></i>
          </div>
          <div class="li-content">
            <span>10:00 AM - 11:30 AM • Dentist Appointment</span>
            <span class="li-subtitle">City Dental Clinic</span>
          </div>
        </div>
        
        <div style="position: fixed; bottom: 16px; right: 16px; width: 56px; height: 56px; border-radius: 28px; background-color: var(--color-primary); display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
          <i class="fas fa-plus" style="color: white; font-size: 24px;"></i>
        </div>
      </div>
        </div>
    </div>


        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    return modal;
  }
  
  // Initialize the template system
  function initializeTemplateSystem() {
    // Create the modal if it doesn't exist
    let templateModal = document.getElementById('template-modal');
    if (!templateModal) {
      templateModal = createTemplateModal();
    }
    
    // Get reference to the add template button
    const addTemplateBtn = document.getElementById('addTemplateBtn');
    if (!addTemplateBtn) {
      console.error('Add Template button not found');
      return;
    }
    
    // Add click event to the button
    addTemplateBtn.addEventListener('click', () => {
      templateModal.style.display = 'flex';
    });
    
    // Close modal when clicking the close button
    const closeBtn = templateModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      templateModal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    templateModal.addEventListener('click', (e) => {
      if (e.target === templateModal) {
        templateModal.style.display = 'none';
      }
    });
    
    // Handle template selection
    const templateCards = templateModal.querySelectorAll('.template-card');
    templateCards.forEach(card => {
      card.addEventListener('click', () => {
        const templateType = card.getAttribute('data-template');
        applyTemplate(templateType);
        templateModal.style.display = 'none';
      });
    });
  }
  
  // Apply the selected template to a new canvas
  function applyTemplate(template) {
    // First, create a new canvas
    createNewCanvasAndApplyTemplate(template);
  }
  
  // Function to create a new canvas and then apply the template to it
  function createNewCanvasAndApplyTemplate(template) {
    // Find the Add Canvas button and click it to create a new canvas
    const addCanvasBtn = document.querySelector('.add-canvas-btn');
    if (!addCanvasBtn) {
      console.error('Add Canvas button not found');
      return;
    }
  
    // Click the button to create a new canvas
    addCanvasBtn.click();
    
    setTimeout(() => {
      // The newly created canvas should now be the last one and selected
      const allCanvases = document.querySelectorAll('.canvas');
      const newCanvas = allCanvases[allCanvases.length - 1];
      
      if (!newCanvas) {
        console.error('New canvas not found after creation');
        return;
      }
      
      // Make sure it's selected
      if (!newCanvas.classList.contains('selected')) {
        newCanvas.click();
      }
      
      const canvasContent = newCanvas.querySelector('.canvas-content');
      if (!canvasContent) {
        console.error('Canvas content not found in new canvas');
        return;
      }
      
      // Clear any default content
      canvasContent.innerHTML = '';
      
      // Apply template based on selection with direct variants
      switch (template) {
        case 'template1': // Profile Template
          const profileButtons = [
            { selector: '[data-component="image"]', type: 'image', variant: 1 }, 
            { selector: '[data-component="avatar"]', type: 'avatar', variant: 7 }, // Avatar with badge
            { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
            { selector: '[data-component="chipGroup"]', type: 'chipGroup' },
            { selector: '[data-component="heading"]', type: 'heading' },
            { selector: '[data-component="paragraph"]', type: 'paragraph'},
            { selector: '[data-component="imgGallery"]', type: 'imgGallery' },
            { selector: '[data-component="button"]', type: 'button', variant: 2 }, // Ghost button
          ];
          
          addComponentsFromButtons(profileButtons, canvasContent);
          break;
          
        case 'template2': // Content Template
          const contentButtons = [
            { selector: '[data-component="hero"]', type: 'hero', variant: 2 }, // Centered hero with button
            { selector: '[data-component="heading"]', type: 'heading' },
            { selector: '[data-component="paragraph"]', type: 'paragraph', repeat: 2 },
            { selector: '[data-component="icon"]', type: 'icon' },
            { selector: '[data-component="accordion"]', type: 'accordion' },
            { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
            { selector: '[data-component="footer"]', type: 'footer' }
          ];
          
          addComponentsFromButtons(contentButtons, canvasContent);
          break;
          
        case 'template3': // Form Template
          const formButtons = [
            { selector: '[data-component="heading"]', type: 'heading' },
            { selector: '[data-component="paragraph"]', type: 'paragraph' },
            { selector: '[data-component="input"]', type: 'input', variant: 2 }, // Required input with asterisk
            { selector: '[data-component="textarea"]', type: 'textarea', variant: 1 }, // Textarea with label
            { selector: '[data-component="label"]', type: 'label' },
            { selector: '[data-component="dropdown"]', type: 'dropdown' },
            { selector: '[data-component="label"]', type: 'label' },
            { selector: '[data-component="checkbox"]', type: 'checkbox', repeat: 3 },
            { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
            { selector: '[data-component="button"]', type: 'button', variant: 4 } // Double button
          ];
          
          addComponentsFromButtons(formButtons, canvasContent);
          break;
          
        case 'social': // Social Template
          const socialButtons = [
            { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 3 }, // Chat navbar
            { selector: '[data-component="heading"]', type: 'heading' },
            // { selector: '[data-component="leftChat"]', type: 'leftChat' },
            { selector: '[data-component="card"]', type: 'card', variant: 4 }, // Social card
            // { selector: '[data-component="rightChat"]', type: 'rightChat' },
            { selector: '[data-component="card2"]', type: 'card2', variant: 6 }, // Achievement card
            { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
            { selector: '[data-component="chatInput"]', type: 'chatInput', variant: 2 } // Chat input with icons
          ];
          
          addComponentsFromButtons(socialButtons, canvasContent);
          
          // Find the first heading and set its text to "Social Feed"
          setTimeout(() => {
            const headingElement = canvasContent.querySelector('h1');
            if (headingElement) {
              headingElement.textContent = 'Social Feed';
            }
          }, 1000);
          
          break;
          
        case 'dashboard': // Dashboard Template
          const dashboardButtons = [
            { selector: '[data-component="heading"]', type: 'heading' },
            { selector: '[data-component="paragraph"]', type: 'paragraph' },
            { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
            { selector: '[data-component="progressBar"]', type: 'progressBar', variant: 5 },
            { selector: '[data-component="progressBar"]', type: 'progressBar', variant: 3 },
            { selector: '[data-component="columns"]', type: 'columns'},
            { selector: '[data-component="graph"]', type: 'graph' },
            { selector: '[data-component="paragraph"]', type: 'paragraph' },
            { selector: '[data-component="table"]', type: 'table' }
          ];
          
          addComponentsFromButtons(dashboardButtons, canvasContent);
          
          // Set the heading text to Dashboard
          setTimeout(() => {
            const headingElement = canvasContent.querySelector('h1');
            if (headingElement) {
              headingElement.textContent = 'Dashboard';
            }
          }, 1000);
          
          break;
          
        case 'ecommerce': // E-commerce Template
          const ecommerceButtons = [
            { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 0 }, // Default navbar
            { selector: '[data-component="heading"]', type: 'heading' },
            { selector: '[data-component="searchBar"]', type: 'searchBar', variant: 0 }, // Default search
            { selector: '[data-component="chipGroup"]', type: 'chipGroup' },
            { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
            { selector: '[data-component="card"]', type: 'card', variant: 5 },
            { selector: '[data-component="card2"]', type: 'card2', variant: 1 },
            { selector: '[data-component="card"]', type: 'card', variant: 5 },
            { selector: '[data-component="card2"]', type: 'card2', variant: 3 },
            { selector: '[data-component="featureComparisonCard"]', type: 'featureComparisonCard' },
            { selector: '[data-component="button"]', type: 'button', variant: 2 } // Button with icon right
          ];
          
          addComponentsFromButtons(ecommerceButtons, canvasContent);
          
          // Set the heading text to Product Gallery
          setTimeout(() => {
            const headingElement = canvasContent.querySelector('h1');
            if (headingElement) {
              headingElement.textContent = 'Product Gallery';
            }
          }, 1000);
          
          break;

          case 'mediaGallery': // Media Gallery Template
            const mediaGalleryButtons = [
                { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 2 }, // Centered brand navbar
                { selector: '[data-component="heading"]', type: 'heading' },
                { selector: '[data-component="searchBar"]', type: 'searchBar', variant: 2 }, // Squared search style
                { selector: '[data-component="imgGallery"]', type: 'imgGallery', variant: 0 }, // Standard gallery
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="imgGallery"]', type: 'imgGallery', variant: 2 }, // Grid gallery
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="video"]', type: 'video', variant: 0 }, // Thumbnail with play button
                { selector: '[data-component="chipGroup"]', type: 'chipGroup' }, // Tags/categories
                { selector: '[data-component="bottomNav"]', type: 'bottomNav', special: true }
            ];
            
            addComponentsFromButtons(mediaGalleryButtons, canvasContent);
            
            // Update heading text
            setTimeout(() => {
                const headingElement = canvasContent.querySelector('h1');
                if (headingElement) {
                headingElement.textContent = 'Media Gallery';
                }
            }, 1000);
            break;

            // LOGIN/AUTHENTICATION TEMPLATE
        case 'login':
        const loginButtons = [
        { selector: '[data-component="tabs"]', type: 'tabs' },
        { selector: '[data-component="image"]', type: 'image', variant: 5 }, // Circle crop for logo
        { selector: '[data-component="heading"]', type: 'heading' },
        { selector: '[data-component="paragraph"]', type: 'paragraph' },
        { selector: '[data-component="input"]', type: 'input', variant: 2 }, // Input with label
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="input"]', type: 'input', variant: 5 }, // Password input
        { selector: '[data-component="checkbox"]', type: 'checkbox' }, // Remember me checkbox
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="button"]', type: 'button', variant: 0 }, // Login button
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="paragraph"]', type: 'paragraph' } // Forgot password/sign up text
        ];

        addComponentsFromButtons(loginButtons, canvasContent);

        // Update text for specific elements
        setTimeout(() => {
        const tabs = canvasContent.querySelectorAll('.ui-tab');
        if (tabs.length) {
            tabs[0].textContent = 'Sign In';
            tabs[1].textContent = 'Sign Up';
        }

        const headingElement = canvasContent.querySelector('h1');
        if (headingElement) {
            headingElement.textContent = 'Welcome Back';
        }
        
        const paragraphs = canvasContent.querySelectorAll('p');
        if (paragraphs.length) {
            paragraphs[0].textContent = 'Sign in to your account';
            paragraphs[1].textContent = "Don't have an account? Sign up";
        }
        
        const labels = canvasContent.querySelectorAll('label');
        if (labels.length >= 2) {
            labels[0].textContent = 'Email';
            labels[1].textContent = 'Password';
        }
        
        const checkbox = canvasContent.querySelector('.checkbox-square-icon + span');
        if (checkbox) {
            checkbox.textContent = 'Remember me';
        }
        
        const button = canvasContent.querySelector('.ui-button div[role="button"]');
        if (button) {
            button.textContent = 'SIGN IN';
        }
        }, 2080);
        break;

        // ONBOARDING TEMPLATE
        case 'onboarding': // Onboarding Template
        const onboardingButtons = [
        { selector: '[data-component="image"]', type: 'image', variant: 0 }, // Full-width illustration
        { selector: '[data-component="heading"]', type: 'heading' },
        { selector: '[data-component="paragraph"]', type: 'paragraph' },
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="progressTracker"]', type: 'progressTracker' }, // Step indicator
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="button"]', type: 'button', variant: 0 }, // Next button
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="paragraph"]', type: 'paragraph' } // Skip text
        ];

        addComponentsFromButtons(onboardingButtons, canvasContent);

        // Update text for specific elements
        setTimeout(() => {
        const headingElement = canvasContent.querySelector('h1');
        if (headingElement) {
            headingElement.textContent = 'Welcome to the App';
        }
        
        const paragraphs = canvasContent.querySelectorAll('p');
        if (paragraphs.length >= 2) {
            paragraphs[0].textContent = 'Discover amazing features that will help you accomplish your goals.';
            paragraphs[1].textContent = 'Skip intro';
            paragraphs[1].style.textAlign = 'center';
            paragraphs[1].style.opacity = '0.7';
        }
        
        const button = canvasContent.querySelector('.ui-button div[role="button"]');
        if (button) {
            button.textContent = 'NEXT';
        }
        }, 1000);
        break;
          
        case 'settings': // Settings Template
            const settingsButtons = [
                { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 2 }, // Header with back button
                { selector: '[data-component="avatar"]', type: 'avatar', variant: 6 }, // Avatar with name
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="heading"]', type: 'heading', variant: 'h3' }, // Section heading
                { selector: '[data-component="hzDivider"]', type: 'hzDivider' },
                { selector: '[data-component="listItem"]', type: 'listItem', variant: 2 }, // With subtitle
                { selector: '[data-component="toggleSwitch"]', type: 'toggleSwitch' },
                { selector: '[data-component="listItem"]', type: 'listItem', variant: 2 }, // With subtitle 
                { selector: '[data-component="toggleSwitch"]', type: 'toggleSwitch' },
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="heading"]', type: 'heading', variant: 'h3' }, // Section heading
                { selector: '[data-component="hzDivider"]', type: 'hzDivider' },
                { selector: '[data-component="listItem"]', type: 'listItem', variant: 3 }, // With chevron
                { selector: '[data-component="listItem"]', type: 'listItem', variant: 3 }, // With chevron
                { selector: '[data-component="listItem"]', type: 'listItem', variant: 3 } // With chevron
            ];
            
            addComponentsFromButtons(settingsButtons, canvasContent);
            
            // Update text for specific elements
            setTimeout(() => {
                const headings = canvasContent.querySelectorAll('h1');
                if (headings.length >= 2) {
                headings[0].textContent = 'App Preferences';
                headings[1].textContent = 'Account Settings';
                }
                
                const navbarTitle = canvasContent.querySelector('.navbar span:not(.non-editable)');
                if (navbarTitle) {
                navbarTitle.textContent = 'Settings';
                }
                
                const listItems = canvasContent.querySelectorAll('.li-content span:first-child');
                if (listItems.length) {
                listItems[0].textContent = 'Notifications';
                listItems[1].textContent = 'Dark Mode';
                listItems[2].textContent = 'Profile Information';
                listItems[3].textContent = 'Privacy & Security';
                listItems[4].textContent = 'Help & Support';
                }
                
                const subtitles = canvasContent.querySelectorAll('.li-subtitle');
                if (subtitles.length) {
                subtitles[0].textContent = 'Get updates about new features';
                subtitles[1].textContent = 'Switch to dark mode interface';
                }
            }, 1600);
            break;

            case 'messaging': // Messaging/Chat Template
            const messagingButtons = [
                { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 3 }, // Chat navbar with profile
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                // { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                // { selector: '[data-component="notificationBanner"]', type: 'notificationBanner' }, // Status message
                // { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="leftChat"]', type: 'leftChat' }, // Received message
                { selector: '[data-component="rightChat"]', type: 'rightChat' }, // Sent message
                { selector: '[data-component="leftChat"]', type: 'leftChat' }, // Received message
                // { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="rightChat"]', type: 'rightChat' }, // Sent message with longer text
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="chatInput"]', type: 'chatInput', variant: 4 }, // Input with emoji and attachment
                { selector: '[data-component="bottomNav"]', type: 'bottomNav', special: true }
            ];
            
            addComponentsFromButtons(messagingButtons, canvasContent);
            
            // Update text for specific elements
            setTimeout(() => {
                // Update navbar elements
                const navbarName = canvasContent.querySelector('.navbar span[style*="font-weight: bold"]');
                if (navbarName) {
                navbarName.textContent = 'John Smith';
                }
                
                const navbarStatus = canvasContent.querySelector('.navbar .status');
                if (navbarStatus) {
                navbarStatus.textContent = 'Online';
                }
                
                // Update chat messages
                const chatContents = canvasContent.querySelectorAll('.chat-content');
                if (chatContents.length >= 4) {
                chatContents[0].textContent = 'Hi there! How are you doing today?';
                chatContents[1].textContent = 'Hey! I\'m good, thanks for asking. How about you?';
                chatContents[2].textContent = 'I\'m great! Do you want to meet up this weekend?';
                chatContents[3].textContent = 'Absolutely! I was thinking we could check out that new restaurant downtown.';
                }
                
                // Update avatars
                const leftAvatars = canvasContent.querySelectorAll('.leftChat + .chat-avatar');
                if (leftAvatars.length > 0) {
                leftAvatars.forEach(avatar => {
                    avatar.textContent = 'JS';
                });
                }
                
            }, 1000);
            break;

            case 'restaurant': // Menu/Restaurant Template
            const restaurantButtons = [
                { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 1 }, // Logo + menu navbar
                { selector: '[data-component="hero"]', type: 'hero', variant: 0 }, // Restaurant hero image
                { selector: '[data-component="heading"]', type: 'heading' },
                { selector: '[data-component="chipGroup"]', type: 'chipGroup' }, // Food categories
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="heading"]', type: 'heading', variant: 'h2' }, // Section heading
                { selector: '[data-component="card"]', type: 'card', variant: 3 }, // Horizontal card for dish
                { selector: '[data-component="card"]', type: 'card', variant: 3 }, // Horizontal card for dish
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="heading"]', type: 'heading', variant: 'h2' }, // Section heading
                { selector: '[data-component="card"]', type: 'card', variant: 3 }, // Horizontal card for dish
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="button"]', type: 'button', variant: 0 }, // Order button
                { selector: '[data-component="bottomNav"]', type: 'bottomNav', special: true }
            ];
            
            addComponentsFromButtons(restaurantButtons, canvasContent);
            
            // Update text for specific elements
            setTimeout(() => {
                const headings = canvasContent.querySelectorAll('h1, h2');
                if (headings.length >= 3) {
                headings[0].textContent = 'Delicious Restaurant';
                headings[1].textContent = 'Popular Dishes';
                headings[2].textContent = 'Chef\'s Specials';
                }
                
                // Update chips/categories
                const chips = canvasContent.querySelectorAll('.chip span');
                if (chips.length >= 3) {
                chips[0].textContent = 'Appetizers';
                chips[1].textContent = 'Main Course';
                chips[2].textContent = 'Desserts';
                }
                
                // Update card titles and descriptions
                const cardTitles = canvasContent.querySelectorAll('.card-title');
                if (cardTitles.length >= 3) {
                cardTitles[0].textContent = 'Pasta Carbonara';
                cardTitles[1].textContent = 'Grilled Salmon';
                cardTitles[2].textContent = 'Chocolate Cake';
                }
                
                const cardTexts = canvasContent.querySelectorAll('.card-text');
                if (cardTexts.length >= 3) {
                cardTexts[0].textContent = 'Classic Italian pasta with eggs, cheese, and pancetta';
                cardTexts[1].textContent = 'Fresh salmon fillet with seasonal vegetables';
                cardTexts[2].textContent = 'Rich chocolate cake with vanilla ice cream';
                }
                
                // Update button
                const button = canvasContent.querySelector('.ui-button div[role="button"]');
                if (button) {
                button.textContent = 'VIEW FULL MENU';
                }
                
                // Update bottom nav items
                const navItems = canvasContent.querySelectorAll('.bottom-nav-item span');
                if (navItems.length >= 4) {
                navItems[0].textContent = 'Menu';
                navItems[1].textContent = 'Search';
                navItems[2].textContent = 'Orders';
                navItems[3].textContent = 'Profile';
                }
            }, 1000);
            break;

            // BLOG/ARTICLE TEMPLATE
            case 'blog': // Blog/Article Template
            const blogButtons = [
                { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 0 }, // Simple navbar
                // { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="image"]', type: 'image', variant: 1 }, // Full-width featured image
                { selector: '[data-component="heading"]', type: 'heading' }, // Article title
                { selector: '[data-component="card2"]', type: 'card2', variant: 4 }, // Author card/date
                { selector: '[data-component="paragraph"]', type: 'paragraph' }, // Article intro
                { selector: '[data-component="paragraph"]', type: 'paragraph' }, // Article paragraph
                { selector: '[data-component="heading"]', type: 'heading', variant: 'h2' }, // Subheading
                { selector: '[data-component="paragraph"]', type: 'paragraph' }, // Article paragraph
                { selector: '[data-component="bulletedList"]', type: 'bulletedList' }, // Key points
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="blockquote"]', type: 'blockquote' }, // Quote
                { selector: '[data-component="paragraph"]', type: 'paragraph' }, // Final paragraph
                { selector: '[data-component="hzDivider"]', type: 'hzDivider' },
                { selector: '[data-component="chipGroup"]', type: 'chipGroup' }, // Tags
                { selector: '[data-component="paragraph"]', type: 'paragraph' },
                { selector: '[data-component="imgGallery"]', type: 'imgGallery', variant: 3 }, // Full-width featured image
                { selector: '[data-component="footer"]', type: 'footer' }
            ];
            
            addComponentsFromButtons(blogButtons, canvasContent);
            
            // Update text for specific elements
            setTimeout(() => {
                const headings = canvasContent.querySelectorAll('h1, h2');
                if (headings.length >= 2) {
                headings[0].textContent = 'The Art of Creating User Interfaces';
                headings[1].textContent = 'Design Principles to Remember';
                }
                
                // Update paragraphs
                const paragraphs = canvasContent.querySelectorAll('p');
                if (paragraphs.length >= 4) {
                paragraphs[0].textContent = 'User interface design is at the heart of every digital product. It\'s what users see, interact with, and ultimately judge your product by.';
                paragraphs[1].textContent = 'In today\'s digital landscape, a well-designed user interface can make the difference between a product that succeeds and one that fails. Users have come to expect intuitive, responsive, and visually appealing interfaces that help them accomplish their goals efficiently.';
                paragraphs[2].textContent = 'Applying these principles consistently can elevate your designs from good to great. Each element of your interface should have a purpose and contribute to the overall user experience.';
                paragraphs[3].textContent = 'Remember that great UI design is iterative. Gather feedback, test with real users, and continuously refine your interfaces to create experiences that users love.';
                }
                
                // Update quote
                const blockquote = canvasContent.querySelector('blockquote');
                if (blockquote) {
                blockquote.textContent = 'Design is not just what it looks like and feels like. Design is how it works. — Steve Jobs';
                }
                
                // Update bullet points
                const bulletPoints = canvasContent.querySelectorAll('.bullet-list-item-text');
                if (bulletPoints.length >= 3) {
                bulletPoints[0].textContent = 'Consistency across the interface';
                bulletPoints[1].textContent = 'Clear visual hierarchy and focus';
                bulletPoints[2].textContent = 'User-centered design approach';
                }
                
                // Update chips/tags
                const chips = canvasContent.querySelectorAll('.chip span');
                if (chips.length >= 3) {
                chips[0].textContent = 'Design';
                chips[1].textContent = 'UI/UX';
                chips[2].textContent = 'Tips';
                }
                
                // Update author info
                const quoteAuthor = canvasContent.querySelector('.card-quote-author p');
                if (quoteAuthor) {
                quoteAuthor.textContent = '— Jane Designer, Senior UX Designer';
                }
            }, 1000);
            break;

            // EDUCATIONAL/COURSE TEMPLATE
            case 'education': // Educational/Course Template
            const educationButtons = [
                { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 0 }, // Course header
                { selector: '[data-component="hero"]', type: 'hero', variant: 0 }, // Course banner image
                { selector: '[data-component="heading"]', type: 'heading' }, // Course title
                { selector: '[data-component="paragraph"]', type: 'paragraph' }, // Course description
                { selector: '[data-component="progressBar"]', type: 'progressBar', variant: 0 }, // Course progress
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="heading"]', type: 'heading', variant: 'h2' }, // Module title
                { selector: '[data-component="accordion"]', type: 'accordion' }, // Lesson container
                { selector: '[data-component="listItem"]', type: 'listItem', variant: 3 }, // Lesson item
                { selector: '[data-component="listItem"]', type: 'listItem', variant: 3 }, // Lesson item
                { selector: '[data-component="accordion"]', type: 'accordion' }, // Next module
                { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
                { selector: '[data-component="heading"]', type: 'heading', variant: 'h2' }, // Resources section
                { selector: '[data-component="card"]', type: 'card', variant: 3 }, // Resource link
                { selector: '[data-component="bottomNav"]', type: 'bottomNav', special: true }
            ];
            
            addComponentsFromButtons(educationButtons, canvasContent);
            
            // Update text for specific elements
            setTimeout(() => {
                const headings = canvasContent.querySelectorAll('h1, h2');
                if (headings.length >= 3) {
                headings[0].textContent = 'JavaScript Fundamentals';
                headings[1].textContent = 'Module 1: Getting Started';
                headings[2].textContent = 'Additional Resources';
                }
                
                // Update course description
                const paragraph = canvasContent.querySelector('p');
                if (paragraph) {
                paragraph.textContent = 'Master the basics of JavaScript programming with this comprehensive course. Learn syntax, functions, objects, and more.';
                }
                
                // Update accordion titles
                const accordionTitles = canvasContent.querySelectorAll('.accordion-header span');
                if (accordionTitles.length >= 2) {
                accordionTitles[0].textContent = 'Week 1: JavaScript Basics';
                accordionTitles[1].textContent = 'Week 2: Functions & Objects';
                }
                
                // Update lesson items
                const listItems = canvasContent.querySelectorAll('.li-content span:first-child');
                if (listItems.length >= 2) {
                listItems[0].textContent = 'Lesson 1: Introduction to JavaScript';
                listItems[1].textContent = 'Lesson 2: Variables and Data Types';
                }
                
                // Update resource card
                const cardTitle = canvasContent.querySelector('.card-title');
                if (cardTitle) {
                cardTitle.textContent = 'JavaScript Documentation';
                }
                
                const cardText = canvasContent.querySelector('.card-text');
                if (cardText) {
                cardText.textContent = 'Official documentation and reference guides';
                }
                
                // Update progress bar
                const progressValue = canvasContent.querySelector('.progress-label, [contenteditable="true"]');
                if (progressValue) {
                progressValue.textContent = '25%';
                }
                
                // Update bottom nav items
                const navItems = canvasContent.querySelectorAll('.bottom-nav-item span');
                if (navItems.length >= 4) {
                navItems[0].textContent = 'Courses';
                navItems[1].textContent = 'Search';
                navItems[2].textContent = 'Notes';
                navItems[3].textContent = 'Profile';
                }
            }, 1000);
            break;

            // MAP/LOCATION TEMPLATE
        case 'mapLocation': // Map/Location Template
        const mapLocationButtons = [
        { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 2 }, // Centered title with back button
        { selector: '[data-component="searchBar"]', type: 'searchBar', variant: 0 }, // Search bar for locations
        { selector: '[data-component="colorBlock"]', type: 'colorBlock' }, // Map container placeholder
        { selector: '[data-component="chipGroup"]', type: 'chipGroup' }, // Filter options
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="card"]', type: 'card', variant: 3 }, // Location card horizontal
        { selector: '[data-component="card"]', type: 'card', variant: 3 }, // Location card horizontal
        { selector: '[data-component="card"]', type: 'card', variant: 3 }, // Location card horizontal
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="floatingActionButton"]', type: 'floatingActionButton', special: true } // Navigation FAB
        ];

        addComponentsFromButtons(mapLocationButtons, canvasContent);

        // Update elements with map-specific content
        setTimeout(() => {
        // Update navbar title
        const navbarTitle = canvasContent.querySelector('.navbar span:not(.non-editable)');
        if (navbarTitle) {
            navbarTitle.textContent = 'Explore Nearby';
        }
        
        // Update search bar placeholder
        const searchInput = canvasContent.querySelector('.search-input');
        if (searchInput) {
            searchInput.setAttribute('data-placeholder', 'Search locations...');
        }
        
        // Style map container
        const mapContainer = canvasContent.querySelector('.colorBlock-inner');
        if (mapContainer) {
            mapContainer.style.height = '220px';
            mapContainer.style.backgroundColor = '#e3e9f3';
            
            // Add map pin icon
            const mapPin = document.createElement('div');
            mapPin.className = 'icon-container';
            mapPin.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);';
            mapPin.innerHTML = '<i class="fas fa-map-marker-alt" style="font-size: 32px; color: var(--color-primary);"></i>';
            mapContainer.appendChild(mapPin);
            
            // Add mock map controls
            const mapZoom = document.createElement('div');
            mapZoom.style.cssText = 'position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 5px;';
            
            const zoomIn = document.createElement('button');
            zoomIn.style.cssText = 'width: 30px; height: 30px; border-radius: 4px; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);';
            zoomIn.innerHTML = '<i class="fas fa-plus" style="font-size: 12px;"></i>';
            
            const zoomOut = document.createElement('button');
            zoomOut.style.cssText = 'width: 30px; height: 30px; border-radius: 4px; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);';
            zoomOut.innerHTML = '<i class="fas fa-minus" style="font-size: 12px;"></i>';
            
            mapZoom.appendChild(zoomIn);
            mapZoom.appendChild(zoomOut);
            mapContainer.appendChild(mapZoom);
        }
        
        // Update filter chips
        const chips = canvasContent.querySelectorAll('.chip span');
        if (chips.length >= 3) {
            chips[0].textContent = 'Restaurants';
            chips[1].textContent = 'Hotels';
            chips[2].textContent = 'Attractions';
        }
        
        // Update location cards
        const cardTitles = canvasContent.querySelectorAll('.card-title');
        if (cardTitles.length >= 3) {
            cardTitles[0].textContent = 'Central Park Cafe';
            cardTitles[1].textContent = 'City Museum';
            cardTitles[2].textContent = 'Riverside Hotel';
        }
        
        const cardTexts = canvasContent.querySelectorAll('.card-text');
        if (cardTexts.length >= 3) {
            cardTexts[0].textContent = '⭐ 4.5 (238) • 0.3 miles away';
            cardTexts[1].textContent = '⭐ 4.8 (512) • 0.7 miles away';
            cardTexts[2].textContent = '⭐ 4.2 (189) • 1.2 miles away';
        }
        
        // Update FAB icon to directions
        const fabIcon = canvasContent.querySelector('.fab-icon');
        if (fabIcon) {
            fabIcon.className = 'fas fa-directions fab-icon';
        }
        }, 1000);
        break;

        // CALENDAR/SCHEDULE TEMPLATE
        case 'calendar': // Calendar/Schedule Template
        const calendarButtons = [
        { selector: '[data-component="navbar"]', type: 'navbar', special: true, variant: 0 }, // Simple navbar for calendar
        { selector: '[data-component="heading"]', type: 'heading', variant: 'h2' }, // Month heading
        { selector: '[data-component="table"]', type: 'table' }, // Calendar grid
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="heading"]', type: 'heading', variant: 'h3' }, // Today's events heading
        { selector: '[data-component="hzDivider"]', type: 'hzDivider' },
        { selector: '[data-component="listItem"]', type: 'listItem', variant: 8 }, // Time-based event
        { selector: '[data-component="listItem"]', type: 'listItem', variant: 8 }, // Time-based event
        { selector: '[data-component="listItem"]', type: 'listItem', variant: 9 }, // Special event style
        { selector: '[data-component="adjustableSpace"]', type: 'adjustableSpace' },
        { selector: '[data-component="heading"]', type: 'heading', variant: 'h3' }, // Tomorrow heading
        { selector: '[data-component="hzDivider"]', type: 'hzDivider' },
        { selector: '[data-component="listItem"]', type: 'listItem', variant: 8 }, // Time-based event
        { selector: '[data-component="floatingActionButton"]', type: 'floatingActionButton', special: true } // Add event FAB
        ];

        addComponentsFromButtons(calendarButtons, canvasContent);

        // Update elements with calendar/schedule specific content
        setTimeout(() => {
        // Update navbar title
        const navbarTitle = canvasContent.querySelector('.navbar span:not(.non-editable)');
        if (navbarTitle) {
            navbarTitle.textContent = 'Calendar';
        }
        
        // Update month heading and subheadings
        const headings = canvasContent.querySelectorAll('h2, h3');
        if (headings.length >= 3) {
            headings[0].textContent = 'March 2025';
            headings[1].textContent = 'Today • March 16';
            headings[2].textContent = 'Tomorrow • March 17';
        }
        
        // Set up calendar table
        const table = canvasContent.querySelector('.data-table-main');
        if (table) {
            // Clear any existing content
            const thead = table.querySelector('thead');
            const tbody = table.querySelector('tbody');
            
            if (thead && tbody) {
            // Clear and set up day headers
            thead.innerHTML = '';
            const headerRow = document.createElement('tr');
            ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
                const th = document.createElement('th');
                th.textContent = day;
                th.style.textAlign = 'center';
                th.style.padding = '10px 0';
                th.style.fontWeight = 'bold';
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            
            // Clear and create calendar grid
            tbody.innerHTML = '';
            
            // Create 5 weeks (rows)
            for (let week = 0; week < 5; week++) {
                const row = document.createElement('tr');
                
                // Create 7 days per week (columns)
                for (let day = 1; day <= 7; day++) {
                const td = document.createElement('td');
                
                // Calculate the day number
                let dayNum = (week * 7) + day - 3; // Start from -2 to get the calendar right
                
                if (dayNum >= 1 && dayNum <= 31) {
                    td.textContent = dayNum;
                }
                
                // Style for today
                if (dayNum === 16) {
                    td.style.backgroundColor = 'var(--color-primary)';
                    td.style.color = 'white';
                    td.style.borderRadius = '50%';
                    td.style.fontWeight = 'bold';
                }
                
                // Style for days with events
                if ([5, 10, 15, 17, 23, 27].includes(dayNum)) {
                    const dot = document.createElement('div');
                    dot.style.cssText = 'width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; margin: 2px auto 0;';
                    td.appendChild(dot);
                }
                
                td.style.textAlign = 'center';
                td.style.height = '40px';
                td.style.width = '40px';
                td.style.cursor = 'pointer';
                
                row.appendChild(td);
                }
                
                tbody.appendChild(row);
            }
            }
        }
        
        // Update event list items
        const listItems = canvasContent.querySelectorAll('.li-content span:first-child');
        if (listItems.length >= 4) {
            listItems[0].textContent = '9:00 AM - 10:30 AM • Team Meeting';
            listItems[1].textContent = '2:30 PM - 4:00 PM • Client Presentation';
            listItems[2].textContent = '6:00 PM - 8:30 PM • Dinner with Friends';
            listItems[3].textContent = '10:00 AM - 11:30 AM • Dentist Appointment';
        }
        
        // Add different icons to events
        const eventIcons = canvasContent.querySelectorAll('.li-icon i');
        if (eventIcons.length >= 4) {
            eventIcons[0].className = 'fas fa-users';
            eventIcons[1].className = 'fas fa-presentation';
            eventIcons[2].className = 'fas fa-utensils';
            eventIcons[3].className = 'fas fa-tooth';
        }
        
        // Style the "special" event
        const specialEvent = canvasContent.querySelectorAll('.li-base')[2];
        if (specialEvent) {
            specialEvent.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
            specialEvent.style.borderLeft = '4px solid var(--color-primary)';
        }
        
        // Update FAB icon to plus for adding events
        const fabIcon = canvasContent.querySelector('.fab-icon');
        if (fabIcon) {
            fabIcon.className = 'fas fa-plus fab-icon';
        }
        }, 1600);
        break;

        ///////// DEFAULT
        default:
          console.error(`Unknown template type: ${template}`);
          break;
      }
      
      // Scroll to the top of the canvas after applying template
      const phoneScrollCon = newCanvas.querySelector('.phoneScrollCon');
      if (phoneScrollCon) {
        phoneScrollCon.scrollTop = 0;
      }
      
      // If there's a project manager, mark this canvas as changed
      if (window.projectManager) {
        const canvasWrapper = newCanvas.closest('.canvas-wrapper');
        if (canvasWrapper) {
          const canvasId = canvasWrapper.getAttribute('data-canvas-id');
          if (window.projectManager && window.projectManager.addCanvasToChanged && canvasId) {
            window.projectManager.addCanvasToChanged(canvasId, `Applied template: ${template}`);
            window.projectManager.contentChanged = true;
          }
        }
      }
    }, 100); // Small delay to ensure canvas is fully created
  }

  // Helper function to add components by clicking buttons
  function addComponentsFromButtons(components, targetContainer) {
    let delay = 0;
    const delayIncrement = 10; // Add a small delay between component additions for stability
    
    components.forEach(({ selector, type, repeat = 1 }) => {
      // Add with a small delay to prevent race conditions
      setTimeout(() => {
        // Find the component button in the sidebar
        const componentBtn = document.querySelector(selector);
        if (!componentBtn) {
          console.warn(`Button for ${type} not found`);
          return;
        }
        
        // Simply click the button multiple times for repeated components
        for (let i = 0; i < repeat; i++) {
          componentBtn.click();
        }
      }, delay);
      
      delay += delayIncrement * repeat;
    });
  }
  
  // Initialize the template system when the DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Wait a short delay to ensure the editor is fully initialized
    setTimeout(initializeTemplateSystem, 500);
  });
  
  // If the document is already loaded, initialize with a delay
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeTemplateSystem, 500);
  }

  function addComponentsFromButtons(components, targetContainer) {
    let delay = 0;
    const delayIncrement = 10;
    
    components.forEach(({ selector, type, repeat = 1, variant = 0 }) => {
      setTimeout(() => {
        // Find the component button in the sidebar
        const componentBtn = document.querySelector(selector);
        if (!componentBtn) {
          console.warn(`Button for ${type} not found`);
          return;
        }
        
        for (let i = 0; i < repeat; i++) {
          // Click to create the component
          componentBtn.click();
          
          // Apply the variant directly after a small delay
          setTimeout(() => {
            applyDirectVariant(targetContainer, type, variant);
          }, 50);
        }
      }, delay);
      
      delay += delayIncrement * repeat;
    });
  }
  
  // Directly apply a variant by setting the HTML content
  // Simplified approach using the existing setupVariantControls
function applyDirectVariant(container, componentType, variantIndex) {
  // Get all components of the specified type in this container
  const components = Array.from(container.querySelectorAll(`.component-container[data-component-type="${componentType}"]`));
  
  if (components.length === 0) {
    console.warn(`No components of type ${componentType} found to apply variant`);
    return;
  }
  
  // Get the most recently added component
  const component = components[components.length - 1];
  const content = component.querySelector('.component-content');
  
  if (!content) {
    console.warn(`Component content not found for ${componentType}`);
    return;
  }
  
  // First, ensure the variant controls are set up
  if (!component.querySelector('.variant-controls')) {
    // If variant controls don't exist yet, use the editor's setupVariantControls
    if (window.editor && window.editor.setupVariantControls) {
      window.editor.setupVariantControls(component, content, componentType);
    }
  }
  
  // Now find the variant controls
  const variantControls = component.querySelector('.variant-controls');
  if (!variantControls) {
    console.warn(`Variant controls not found for ${componentType}, component might not have variants`);
    return;
  }
  
  // Find the navigation buttons
  const nextBtn = variantControls.querySelector('.next-nav');
  const prevBtn = variantControls.querySelector('.prev-nav');
  
  if (!nextBtn || !prevBtn) {
    console.warn('Variant navigation buttons not found');
    return;
  }
  
  // Get current variant index
  const currentVariant = parseInt(content.dataset.currentVariant || '0');
  const variants = setupVariants(componentType) || [];
  const totalVariants = variants.length;
  
  if (totalVariants <= 1) {
    return; // No variants to change
  }
  
  // Calculate the shortest path to the desired variant (forward or backward)
  const forwardClicks = (variantIndex - currentVariant + totalVariants) % totalVariants;
  const backwardClicks = (currentVariant - variantIndex + totalVariants) % totalVariants;
  
  // Click the appropriate button the minimum number of times
  if (forwardClicks <= backwardClicks) {
    for (let i = 0; i < forwardClicks; i++) {
      nextBtn.click();
    }
  } else {
    for (let i = 0; i < backwardClicks; i++) {
      prevBtn.click();
    }
  }
}

// Add components with variants to the template
function addComponentsFromButtons(components, targetContainer) {
  let delay = 0;
  const delayIncrement = 100;
  
  components.forEach(({ selector, type, repeat = 1, variant = 0 }) => {
    setTimeout(() => {
      // Find the component button in the sidebar
      const componentBtn = document.querySelector(selector);
      if (!componentBtn) {
        console.warn(`Button for ${type} not found`);
        return;
      }
      
      for (let i = 0; i < repeat; i++) {
        // Click to create the component
        componentBtn.click();
        
        // Wait a bit longer to ensure the component is fully initialized
        setTimeout(() => {
          applyDirectVariant(targetContainer, type, variant);
        }, 50);
      }
    }, delay);
    
    delay += delayIncrement * repeat;
  });
}
  