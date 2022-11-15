import React from 'react'
import './Contact.css'

const Contact = () => {
  return (
    <>
    <div className="contact pt-50">
        <div className="contact__header">
            <h3 className="contact__header-title">Contact us</h3>
            <p className="contact__header--text">We are always looking for new projects to undertake and are always open to new ideas. If you have any suggestions, please don't hesitate to contact us.</p>
        </div>

            <div className="contact__body mb-60px">
                <div className="contact__content_right">
                    <p>
                        Hey, you have any suggestions, please don't hesitate to contact us.
                    </p>

                    <ul>
                        <li><i className="fa fa-check-circle"></i> <span>Address:</span> 107 Central Street Nkana East, Kitwe, Zambia</li>
                        <li><i className="fa fa-check-circle"></i> <span>Email:</span>water4lifezambia@gmail.com</li>
                        <li><i className="fa fa-check-circle"></i> <span>Phone:</span> +1 123 456 7890</li>
                        <li><i className="fa fa-check-circle"></i> <span>Postal Code:</span> 123456</li>
                    </ul>

                </div>

                <div className="contact__content_left">
                    <form className="contact__form">
                        <div className="contact__form__field">
                            <label className="contact__form__label">Name</label>
                            <input className="contact__form__input" type="text" name="name" placeholder = "Enter your name" required />
                            <label className="contact__form__label">Email</label>
                            <input className="contact__form__input" type="email" name="email" placeholder = "Enter your email" required />
                            <label className="contact__form__label">Message</label>
                            <textarea className="contact__form__message" name="message" placeholder = "Enter your message" required />
                            </div>
                            <button className="contact__form__button mt-10" type="submit">Send Message</button>
                    </form>
                </div>
            </div>
     </div>
    </>
  )
}

export default Contact