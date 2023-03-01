import React, { Component } from 'react';
import Moment from 'moment';

const Info_box = ({ title, quantity, card_tag, iconClass, iconBg, imageUrl, months, dates, viewAll, insuranceExpiry, insVisaExpiry, visaExpiry, role }) => (
    
    <div className="card d-block p-1 h-100 shadow-sm">
        <div className="row h-100 no-gutters">
            <div className="col-4 p-3 py-2">
                <div className={iconBg}> <span className={iconClass}><img src={imageUrl} title="" /> </span> </div>
                <p className="text-nowrap text-grey pt-4">{title}</p>
            </div>
            <div className="col-8 text-right p-3 py-2">
                
                    {insuranceExpiry && (role === 'super-admin' || role === 'hr') ? (
                        <div className="d-flex">
                        {insVisaExpiry.insurance && insVisaExpiry.insurance.count.length > 0 ? (insVisaExpiry.insurance.count.map((data, index) => {
                            const insuranceUrl = index === 0 ? '/employees/insurance/'+Moment().format('M') : '/employees/insurance/'+Moment().add(1, 'months').format('M');
                            return <a href={insuranceUrl}><div className="patchTag">
                                <small className="font-14">{index === 0 ? Moment().format('MMM') + "'" + Moment().format('YY') : Moment().add(1, 'months').format('MMM') + "'" + Moment().format('YY')}</small>
                                <strong className="font-16">{data.ins_count}</strong>
                                {/* <small>{viewAll}</small> */}
                            </div>
                            </a>

                        }))
                            : <><div className="patchTag">
                                <small className="font-14">{Moment().format('MMM') + "'" + Moment().format('YY')}</small>
                                <strong className="font-16">0</strong>

                            </div>
                                <div className="patchTag">
                                    <small className="font-14">{Moment().add(1, 'months').format('MMM') + "'" + Moment().format('YY')}</small>
                                    <strong className="font-16">0</strong>

                                </div>
                            </>}
                    </div>) : ''}

                    {visaExpiry && (role === 'super-admin' || role === 'hr')? (
                        <div className="d-flex">
                        {insVisaExpiry.visa && insVisaExpiry.visa.count.length > 0 ? (insVisaExpiry.visa.count.map((data, index) => {
                            const visaUrl = index === 0 ? '/employees/visa/'+Moment().format('M') : '/employees/visa/'+Moment().add(1, 'months').format('M');
                            return <a href={visaUrl}><div className="patchTag">
                                <small className="font-14">{index === 0 ? Moment().format('MMM') + "'" + Moment().format('YY') : Moment().add(1, 'months').format('MMM') + "'" + Moment().format('YY')}</small>
                                <strong className="font-16">{data.visa_count}</strong>
                                {/* <small>{viewAll}</small> */}
                            </div>
                            </a>

                        }))
                            : <><div className="patchTag">
                                <small className="font-14">{Moment().format('MMM') + "'" + Moment().format('YY')}</small>
                                <strong className="font-16">0</strong>

                            </div>
                                <div className="patchTag">
                                    <small className="font-14">{Moment().add(1, 'months').format('MMM') + "'" + Moment().format('YY')}</small>
                                    <strong className="font-16">0</strong>

                                </div>
                            </>}
                    </div>) : ''}

                    {visaExpiry ? (<p className="text-green">{card_tag ? card_tag : ''}</p>) : (<p className="text-green">&nbsp;{card_tag ? card_tag : ''}</p>)}    
                    
                    {insuranceExpiry ? '' : (<h3 className={!visaExpiry ? "text-nowrap text-grey pt-4" : "text-nowrap text-grey"} >{ quantity }</h3>)}
                    

                </div>
            </div>
        </div>
 
)


export default Info_box;
