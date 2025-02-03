import React from 'react'
import { FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const EmblemMotto = () => {
  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Emblem and Motto</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li>Emblem and Motto</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="about-page-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 d-none d-sm-none d-md-block d-lg-block">
              <h3 className="heading-primary2 butler-regular text-white">About Us</h3>
              <div className="heading-divider mb-3"></div>
              <ul className="mcd-menu">
                <li>
                  <Link to="/about" className="active">
                    <i className="fa fa-university" />
                    <strong>Introduction</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
                <li>
                  <Link to="/vision-mission">
                    <i className="fa fa-eye" />
                    <strong>Vision &amp; Mission</strong>
                    <small>National Law University Prayagraj</small>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
              <div className="section-title-wrapper">
                <div className="section-title">
                  <h3 className="heading-primary3 butler-regular">Emblem and Motto</h3>
                </div>
              </div>
              <div className="about-text-container">
                <div className="row">
                  <div className="col-sm-12">
                    <h3 className="Sub_Heading">यान्ति न्यायप्रवृत्तस्य:</h3>
                    <p className="heading-para gorditas-regular">
                      <img
                        src="https://www.rpnlup.ac.in/wp-content/uploads/2023/12/logo.png"
                        style={{
                          float: "right",
                          marginLeft: 10,
                          marginBottom: 10,
                          background: "#fff",
                          borderRadius: "10px",
                          border: "2px solid #BFB9B7",
                          padding: "20px"
                        }}
                      />
                      "यान्ति न्यायप्रवृत्तस्य" का शाब्दिक अर्थ है ‘न्याय मार्ग पर चलने वाला’ (The literal meaning of this phrase is "The One who is engaged in a virtuous way of life").
                      <h6 className="Sub_Heading">The complete Shloka from the Ramayana is as follows:</h6>
                      <p>यान्ति न्यायप्रवृत्तस्य तिर्यङ्कोऽपि सहायताम् । अपन्थानं तु गच्छन्तं सोदरोऽपि विमुञ्चति ॥</p>
                      <p>
                        One who is engaged in a virtuous way of life, even lowly animals come forward to offer assistance. On the other hand, a person who follows an immoral path will even be abandoned by his own brother.
                      </p>
                      <h6 className="Sub_Heading">Laurel Leaves</h6>
                      <p>
                        The laurel leaves in the logo hold profound significance, symbolizing victory, achievement, and honor. Their classical and timeless design conveys stability and longevity, making them ideal for brands that seek to convey tradition. Laurel leaves evoke qualities of leadership and authority. Additionally, their natural connotations suggest eco-friendliness and adaptability. The laurel is a versatile symbol, representing success, prestige, and quality, which transcends time and resonates with diverse audiences. It can also signify the hopeful pursuit of success in the search for the True Word.
                      </p>
                      <h6 className="Sub_Heading">Balance of Justice on a Pen</h6>
                      <p>
                        The combination of the pen and the scales of justice in a law institution’s logo is rich in symbolism. The pen signifies the knowledge and documentation that are integral to the legal profession, embodying authority and professionalism. The scales of justice represent fairness, equality, and impartiality in legal proceedings. Together, these symbols encapsulate meticulous legal knowledge and a commitment to the pursuit of justice. The balance of justice resting on the pen reflects the dedication to upholding the law with precision, ensuring that legal processes are conducted with objectivity and integrity. It emphasizes the importance of the rule of law, where legal decisions should be rooted in established principles rather than arbitrary judgments. Furthermore, this juxtaposition suggests an openness to innovation in the legal field, acknowledging the evolving nature of law while remaining grounded in tradition. This symbol encapsulates a multi-faceted representation of justice, legal authority, educational commitment, and adaptability within the legal profession.
                      </p>
                      <h6 className="Sub_Heading">Symbol of Knowledge: The Book</h6>
                      <p>
                        The book in the emblem symbolizes a commitment to knowledge, learning, and academic excellence. It reflects the University’s dedication to providing a high-quality, well-rounded education. The book also represents tradition, highlighting the University’s historical roots and adherence to established academic principles. Furthermore, it conveys the diversity of disciplines offered, showcasing a comprehensive educational experience. Whether emphasizing research, innovation, or effective communication, the book communicates the University’s core values and mission. This design choice underscores the institution’s professionalism and highlights its role in fostering intellectual growth and the exchange of ideas.
                      </p>
                      <h6 className="Sub_Heading">Confluence of Ganga and Yamuna Rivers</h6>
                      <p>
                        The confluence of the Ganga and Yamuna rivers symbolizes the merging of Knowledge and Justice, blending the depth of understanding with the structured foundation of regulations. Situated in the holy city of Prayagraj, a historical seat of learning, the University embodies this intersection where accumulated wisdom informs legal principles. Much like the fertile ecosystem created at the confluence of two rivers, the synergy between Knowledge and Justice cultivates holistic problem-solving. In this relationship, Knowledge serves as the fertile soil from which legal principles grow, facilitating informed decision-making. This combination ensures that decisions are not only wise but also grounded in established rules, enhancing their legitimacy. The confluence fosters adaptability, enabling legal education to navigate evolving challenges. Like the dynamic ecosystem nurtured by converging rivers, the integration of Knowledge and Justice creates a rich educational and legal environment that remains resilient in the face of change.
                      </p>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </>

  )
}

export default EmblemMotto