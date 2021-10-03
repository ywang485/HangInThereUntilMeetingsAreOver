using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class HeartChoiceBtn : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        _gameManager = GameManager.GetInstance();
        _button = GetComponent<Button>();
    }

    // Update is called once per frame
    void Update()
    {   
        if (_gameManager.Hearts < requiredHeartAmt)
        {
            _button.interactable = false;
        } else
        {
            _button.interactable = true;
        }
    }

    private GameManager _gameManager;
    private Button _button;

    public int requiredHeartAmt;
}
